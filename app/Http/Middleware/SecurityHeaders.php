<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

// Middleware to set security-related HTTP headers on all responses.
class SecurityHeaders
{
    // Handle an incoming request and set security headers on the response.
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only apply CSP in production.
        if (app()->environment('production')) {
            $csp = implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: https://*.tile.openstreetmap.org https://*.openstreetmap.org",
                "connect-src 'self'",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ]);

            // Set security headers.
            $response->headers->set('Content-Security-Policy', $csp);
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // These apply in all environments.
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}