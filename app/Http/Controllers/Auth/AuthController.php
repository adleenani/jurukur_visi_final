<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Show login page
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    // Show signup page
    public function showSignup()
    {
        return Inertia::render('Auth/Signup');
    }

    // Handle signup
    public function signup(Request $request)
    {
        $request->validate([
            'username'  => 'required|min:4|max:30|unique:users,username',
            'full_name' => 'required|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ]);

        User::create([
            'username'  => $request->username,
            'full_name' => $request->full_name,
            'email'     => $request->email,
            'password'  => password_hash($request->password, PASSWORD_ARGON2ID),
            'role'      => 'pic',
            'is_active' => false, // needs admin approval
        ]);

        return redirect()->route('login')
            ->with('message', 'Account created! Wait for admin approval before logging in.');
    }

    // Handle login
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $key = 'login.' . $request->ip();

        // Check rate limit — max 3 attempts per 15 minutes
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'username' => "Too many attempts. Try again in " . ceil($seconds / 60) . " minutes."
            ]);
        }

        $user = User::where('username', $request->username)->first();

        // Check user exists and password is correct
        if (!$user || !password_verify($request->password, $user->password)) {
            RateLimiter::hit($key, 900); // 900 seconds = 15 minutes
            return back()->withErrors(['username' => 'Invalid username or password.']);
        }

        // Check account is approved
        if (!$user->is_active) {
            return back()->withErrors(['username' => 'Your account is pending admin approval.']);
        }

        // Generate 2FA code and send email
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update([
            'tfa_code'   => Hash::make($code),
            'updated_at' => now(),
        ]);

        Mail::raw("Your Jurukur Visi login code is: $code\n\nThis code expires in 10 minutes.", function ($message) use ($user) {
            $message->to($user->email)->subject('Your Login Verification Code');
        });

        // Store user ID in session temporarily until 2FA is confirmed
        session(['2fa_user_id' => $user->id, '2fa_expires' => now()->addMinutes(10)]);

        RateLimiter::clear($key);

        return redirect()->route('2fa.show');
    }

    // Show 2FA page
    public function show2FA()
    {
        if (!session('2fa_user_id')) {
            return redirect()->route('login');
        }
        return Inertia::render('Auth/TwoFactor');
    }

    // Verify 2FA code
    public function verify2FA(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        if (!session('2fa_user_id') || now()->gt(session('2fa_expires'))) {
            return redirect()->route('login')
                ->withErrors(['code' => 'Session expired. Please login again.']);
        }

        $user = User::find(session('2fa_user_id'));

        if (!$user || !Hash::check($request->code, $user->tfa_code)) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        // Clear 2FA code and create real session
        $user->update(['tfa_code' => null]);
        session()->forget(['2fa_user_id', '2fa_expires']);

        session()->regenerate();
        session([
            'user_id'   => $user->id,
            'username'  => $user->username,
            'user_role' => $user->role,
        ]);

        return redirect()->route('dashboard');
    }

    // Logout
    public function logout()
    {
        session()->flush();
        session()->regenerate();
        return redirect()->route('login')
            ->with('message', 'You have been logged out.');
    }
}