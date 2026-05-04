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
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => session('username'),
            ],
            'flash' => [
                'success' => session('success'),
                'message' => session('message'),
                'error' => session('error'),
                'timestamp' => now()->timestamp, // forces re-trigger every request
            ],
            'errors' => session('errors')
                ? session('errors')->getBag('default')->getMessages()
                : (object) [],
        ]);
    }
}