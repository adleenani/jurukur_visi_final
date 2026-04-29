<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

// Middleware to check user role and access permissions.
class CheckRole
{
    // Check if the user has the required role to access the route.
    public function handle(Request $request, Closure $next, string $role = 'pic')
    {
        // Check if user is logged in
        if (!session('user_id')) {
            return redirect()->route('login')
                ->withErrors(['auth' => 'Please login to access this page.']);
        }

        // Allow access to change password page even if must_change_password is true.
        if (session('must_change_password') && !$request->is('change-password')) {
            return redirect()->route('password.change');
        }

        // Check if user role matches the required role or is admin.
        if (session('user_role') !== $role && session('user_role') !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}