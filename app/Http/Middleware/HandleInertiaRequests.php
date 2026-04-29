<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

// Middleware to handle Inertia requests and share common data with all Inertia responses.
class HandleInertiaRequests extends Middleware
{
    // Root template for Inertia responses
    protected $rootView = 'app';

    // Determine the current asset version (for cache busting).
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    // Define the props that are shared by default with all Inertia responses.
    public function share(Request $request): array
    {
        // Share flash messages and authenticated user info with all Inertia responses.
        return [
            ...parent::share($request),
            'flash' => [
                'success' => session('success'),
                'message' => session('message'),
                'error' => session('error'),
            ],
            'auth' => [
                'user' => session('username'),
                'role' => session('user_role'),
            ],
        ];
    }
}