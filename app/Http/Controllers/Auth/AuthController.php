<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showSignup()
    {
        return Inertia::render('Auth/Signup');
    }

    public function signup(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|min:4|max:30|alpha_num|unique:users,username',
            'full_name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
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

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $key = 'login.' . $request->ip();

        // Rate limiting — 3 attempts max
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'username' => 'Too many attempts. Try again in ' . ceil($seconds / 60) . ' minutes.',
            ]);
        }

        $user = User::where('username', $request->username)->first();

        // Check credentials
        if (!$user || !password_verify($request->password, $user->password)) {
            RateLimiter::hit($key, 900);
            return back()->withErrors(['username' => 'Invalid username or password.']);
        }

        // Check account approved
        if (!$user->is_active) {
            return back()->withErrors(['username' => 'Your account is pending admin approval.']);
        }

        // Generate 6-digit OTP
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store hashed OTP in DB
        $user->update(['tfa_code' => Hash::make($code)]);

        // Send email
        try {
            Mail::raw(
                "Hello {$user->full_name},\n\n" .
                "Your Jurukur Visi login verification code is:\n\n" .
                "    {$code}\n\n" .
                "This code expires in 10 minutes.\n\n" .
                "If you did not request this, please ignore this email.\n\n" .
                "— Jurukur Visi System",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Your Jurukur Visi Login Code');
                }
            );
        } catch (\Exception $e) {
            Log::error('2FA email failed: ' . $e->getMessage());
            return back()->withErrors(['username' => 'Failed to send verification email. Please try again.']);
        }

        // Store temp session for 2FA
        session([
            '2fa_user_id' => $user->id,
            '2fa_expires' => now()->addMinutes(10)->timestamp,
        ]);

        RateLimiter::clear($key);

        return redirect()->route('2fa.show');
    }

    public function show2FA()
    {
        if (!session('2fa_user_id')) {
            return redirect()->route('login');
        }

        // Check if 2FA session expired
        if (now()->timestamp > session('2fa_expires')) {
            session()->forget(['2fa_user_id', '2fa_expires']);
            return redirect()->route('login')
                ->withErrors(['username' => 'Session expired. Please login again.']);
        }

        return Inertia::render('Auth/TwoFactor');
    }

    public function verify2FA(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        if (!session('2fa_user_id')) {
            return redirect()->route('login')
                ->withErrors(['code' => 'Session expired. Please login again.']);
        }

        if (now()->timestamp > session('2fa_expires')) {
            session()->forget(['2fa_user_id', '2fa_expires']);
            return redirect()->route('login')
                ->withErrors(['username' => 'Verification code expired. Please login again.']);
        }

        $user = User::find(session('2fa_user_id'));

        if (!$user) {
            return redirect()->route('login');
        }

        if (!Hash::check($request->code, $user->tfa_code)) {
            return back()->withErrors(['code' => 'Invalid verification code. Please try again.']);
        }

        // Clear OTP
        $user->update(['tfa_code' => null]);
        session()->forget(['2fa_user_id', '2fa_expires']);

        // Create session
        session()->regenerate();
        session([
            'user_id' => $user->id,
            'username' => $user->username,
            'user_role' => $user->role,
            'must_change_password' => $user->must_change_password,
        ]);

        // Force password change if needed
        if ($user->must_change_password) {
            return redirect()->route('password.change')
                ->with('message', 'Welcome! Please set your own password before continuing.');
        }

        return redirect()->route('dashboard')
            ->with('success', 'Welcome back, ' . $user->full_name . '!');
    }

    public function showChangePassword()
    {
        // Must be logged in
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        // If they don't need to change password, redirect to dashboard
        if (!session('must_change_password')) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/ChangePassword');
    }

    public function changePassword(Request $request)
    {
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        $request->validate([
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'confirmed', // requires password_confirmation field
            ],
        ], [
            'password.confirmed' => 'Passwords do not match.',
            'password.min' => 'Password must be at least 14 characters.',
            'password.regex' => 'Password must contain at least one uppercase letter and one number.',
        ]);

        $user = User::find(session('user_id'));

        // Make sure new password is different from old one
        if (password_verify($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Your new password must be different from your current password.',
            ]);
        }

        $user->update([
            'password' => password_hash($request->password, PASSWORD_ARGON2ID),
            'must_change_password' => false,
        ]);

        // Update session
        session(['must_change_password' => false]);

        return redirect()->route('dashboard')
            ->with('success', 'Password changed successfully! Welcome to Jurukur Visi.');
    }

    public function logout()
    {
        session()->flush();
        session()->regenerate();
        return redirect()->route('login')
            ->with('message', 'You have been logged out successfully.');
    }
}