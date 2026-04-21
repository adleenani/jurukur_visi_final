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
        $validated = $request->validate([
            'username' => 'required|min:4|max:30|alpha_num|unique:users,username',
            'full_name' => 'required|string|max:100|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email:rfc|max:100|unique:users,email',
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ]);

        User::create([
            'username' => $validated['username'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => password_hash($validated['password'], PASSWORD_ARGON2ID),
            'role' => 'pic',
            'is_active' => false,
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

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'username' => "Too many attempts. Try again in " . ceil($seconds / 60) . " minutes."
            ]);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            RateLimiter::hit($key, 900);
            return back()->withErrors(['username' => 'Invalid username or password.']);
        }

        $passwordValid = password_verify($request->password, $user->password)
            || \Illuminate\Support\Facades\Hash::check($request->password, $user->password);

        if (!$passwordValid) {
            RateLimiter::hit($key, 900);
            return back()->withErrors(['username' => 'Invalid username or password.']);
        }

        if (!$user->is_active) {
            return back()->withErrors(['username' => 'Your account is pending admin approval.']);
        }

        // Skip 2FA for now — go straight to dashboard
        RateLimiter::clear($key);
        session()->regenerate();
        session([
            'user_id' => $user->id,
            'username' => $user->username,
            'user_role' => $user->role,
        ]);

        return redirect()->route('dashboard');
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
            'user_id' => $user->id,
            'username' => $user->username,
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
            ->with('message', 'You have been logged out successfully.');
    }
}