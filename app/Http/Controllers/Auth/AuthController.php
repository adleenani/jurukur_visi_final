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

// Controller for handling authentication (login, 2FA, password change).
class AuthController extends Controller
{

    // Show login form.
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    // Show signup form.
    public function showSignup()
    {
        return Inertia::render('Auth/Signup');
    }

    // Handle signup form submission.
    public function signup(Request $request)
    {
        // Validate input with strong rules and custom messages.
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

        // Create new user with hashed password and default role 'pic', but set is_active to false until admin approval.
        User::create([
            'username' => $validated['username'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => password_hash($validated['password'], PASSWORD_ARGON2ID),
            'role' => 'pic',
            'is_active' => false,
        ]);

        // Redirect to login with message about account creation and pending approval.
        return redirect()->route('login')
            ->with('message', 'Account created! Wait for admin approval before logging in.');
    }

    // Handle login form submission.
    public function login(Request $request)
    {
        // Validate input with strong rules
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $key = 'login.' . $request->ip();

        // Rate limiting — 3 attempts max. If exceeded, block for 15 minutes.
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'username' => 'Too many attempts. Try again in ' . ceil($seconds / 60) . ' minutes.',
            ]);
        }

        // Find user by username.
        $user = User::where('username', $request->username)->first();

        // Check credentials.
        if (!$user || !password_verify($request->password, $user->password)) {
            RateLimiter::hit($key, 900);
            return back()->withErrors(['username' => 'Invalid username or password.']);
        }

        // Check account approved.
        if (!$user->is_active) {
            return back()->withErrors(['username' => 'Your account is pending admin approval.']);
        }

        // Generate 6-digit OTP.
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store hashed OTP in DB.
        $user->update(['tfa_code' => Hash::make($code)]);

        // Send email.
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

            // Log the error and show a generic message to the user.
            Log::error('2FA email failed: ' . $e->getMessage());
            return back()->withErrors(['username' => 'Failed to send verification email. Please try again.']);
        }

        // Store temp session for 2FA.
        session([
            '2fa_user_id' => $user->id,
            '2fa_expires' => now()->addMinutes(10)->timestamp,
        ]);

        // Clear login attempts on successful password verification.
        RateLimiter::clear($key);

        // Redirect to 2FA verification page
        return redirect()->route('2fa.show');
    }

    // Show 2FA verification form.
    public function show2FA()
    {
        // Must have temp 2FA session to access this page.
        if (!session('2fa_user_id')) {
            return redirect()->route('login');
        }

        // Check if 2FA session expired.
        if (now()->timestamp > session('2fa_expires')) {
            session()->forget(['2fa_user_id', '2fa_expires']);
            return redirect()->route('login')
                ->withErrors(['username' => 'Session expired. Please login again.']);
        }

        // Show 2FA form.
        return Inertia::render('Auth/TwoFactor');
    }

    // Handle 2FA verification.
    public function verify2FA(Request $request)
    {
        // Validate input.
        $request->validate(['code' => 'required|digits:6']);

        // Check temp 2FA session.
        if (!session('2fa_user_id')) {
            return redirect()->route('login')
                ->withErrors(['code' => 'Session expired. Please login again.']);
        }

        // Check if 2FA session expired. This is a second check in case they submit the form after the session expires.
        if (now()->timestamp > session('2fa_expires')) {
            session()->forget(['2fa_user_id', '2fa_expires']);
            return redirect()->route('login')
                ->withErrors(['username' => 'Verification code expired. Please login again.']);
        }

        $user = User::find(session('2fa_user_id'));

        // If user not found (shouldn't happen), redirect to login. This is a safety check in case the user was deleted after starting the login process.
        if (!$user) {
            return redirect()->route('login');
        }

        // Verify OTP. Use Hash::check to compare the provided code with the hashed code in the database.
        if (!Hash::check($request->code, $user->tfa_code)) {
            return back()->withErrors(['code' => 'Invalid verification code. Please try again.']);
        }

        // Clear OTP. This ensures the code can only be used once, even if the session is somehow compromised.
        $user->update(['tfa_code' => null]);
        session()->forget(['2fa_user_id', '2fa_expires']);

        // Create session. Regenerate session ID to prevent fixation attacks, and store user info in session.
        session()->regenerate();
        session([
            'user_id' => $user->id,
            'username' => $user->username,
            'user_role' => $user->role,
            'must_change_password' => $user->must_change_password,
        ]);

        // Force password change if needed. This is important for security, especially if the account was just created by an admin or if the password was reset.
        if ($user->must_change_password) {
            return redirect()->route('password.change')
                ->with('message', 'Welcome! Please set your own password before continuing.');
        }

        return redirect()->route('dashboard')
            ->with('success', 'Welcome back, ' . $user->full_name . '!');
    }

    // Show change password form (forced on first login).
    public function showChangePassword()
    {
        // Must be logged in
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        // If they don't need to change password, redirect to dashboard. This prevents users from accessing the change password page unnecessarily after they've already changed their password.
        if (!session('must_change_password')) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/ChangePassword');
    }

    // Handle change password form submission.
    public function changePassword(Request $request)
    {
        // Must be logged in
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        // Validate input.
        $request->validate([
            'password' => [
                'required',
                'min:15',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'confirmed', // requires password_confirmation field
            ],
        ], [
            'password.confirmed' => 'Passwords do not match.',
            'password.min' => 'Password must be at least 15 characters.',
            'password.regex' => 'Password must contain at least one uppercase letter and one number.',
        ]);

        $user = User::find(session('user_id'));

        // Make sure new password is different from old one. This is an important security measure to prevent users from bypassing the forced password change by reusing the same password.
        if (password_verify($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Your new password must be different from your current password.',
            ]);
        }

        // Update password and set must_change_password to false. This allows the user to access the dashboard after changing their password, and ensures they won't be forced to change it again on next login.
        $user->update([
            'password' => password_hash($request->password, PASSWORD_ARGON2ID),
            'must_change_password' => false,
        ]);

        // Update session. This ensures that if they were forced to change their password on first login, they won't be forced again after changing it.
        session(['must_change_password' => false]);

        return redirect()->route('dashboard')
            ->with('success', 'Password changed successfully! Welcome to Jurukur Visi.');
    }

    //  Handle logout.
    public function logout()
    {
        session()->flush();
        session()->regenerate();
        return redirect()->route('login')
            ->with('message', 'You have been logged out successfully.');
    }
}