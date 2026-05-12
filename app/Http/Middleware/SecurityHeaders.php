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
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https://*.tile.openstreetmap.org https://cdnjs.cloudflare.com",
            "connect-src 'self'",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);
        
        $response->headers->set('Content-Security-Policy', $csp);
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // These apply in all environments.
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        $response->headers->set('Access-Control-Allow-Origin', 'https://jurukurvisi.com');
        
        $response->headers->remove('Last-Modified');

        if (session('user_id')) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            $response->headers->set('Pragma', 'no-cache');
        } else {
            $response->headers->set('Cache-Control', 'public, max-age=3600');
        }

        return $response;
    }
}