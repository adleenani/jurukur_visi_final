<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', fn() => Inertia::render('Home'))->name('home');

// Auth routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/signup', [AuthController::class, 'signup']);
Route::get('/2fa', [AuthController::class, 'show2FA'])->name('2fa.show');
Route::post('/2fa', [AuthController::class, 'verify2FA'])->name('2fa.verify');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes (PIC only)
Route::middleware(['role:pic'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
});