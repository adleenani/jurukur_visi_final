<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
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