<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role = 'pic')
    {
        if (!session('user_id')) {
            return redirect()->route('login')
                ->withErrors(['auth' => 'Please login to access this page.']);
        }

        if (session('user_role') !== $role && session('user_role') !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}