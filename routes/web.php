<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/projects', [PublicController::class, 'projects'])->name('projects');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::post('/contact', [PublicController::class, 'submitContact'])->name('contact.submit');

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

    // PIC management     
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/admin/users/{id}/approve', [UserController::class, 'approve'])->name('admin.users.approve');
    Route::post('/admin/users/{id}/reject', [UserController::class, 'reject'])->name('admin.users.reject');

    // Project management
    Route::get('/dashboard', [ProjectController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/projects', [ProjectController::class, 'index'])->name('admin.projects');
    Route::get('/admin/projects/create', [ProjectController::class, 'create'])->name('admin.projects.create');
    Route::post('/admin/projects', [ProjectController::class, 'store'])->name('admin.projects.store');
    Route::get('/admin/projects/{project_id}/edit', [ProjectController::class, 'edit'])->name('admin.projects.edit');
    Route::post('/admin/projects/{project_id}/update', [ProjectController::class, 'update'])->name('admin.projects.update');
    Route::delete('/admin/projects/{project_id}', [ProjectController::class, 'destroy'])->name('admin.projects.destroy');
    Route::post('/admin/projects/{project_id}/delete', [ProjectController::class, 'destroy'])->name('admin.projects.destroy');

    // Booking management
    Route::get('/admin/bookings', [BookingController::class, 'index'])->name('admin.bookings');
    Route::post('/admin/bookings/{reference_number}/confirm', [BookingController::class, 'confirm'])->name('admin.bookings.confirm');
    Route::post('/admin/bookings/{reference_number}/reschedule', [BookingController::class, 'reschedule'])->name('admin.bookings.reschedule');
    Route::post('/admin/bookings/{reference_number}/cancel', [BookingController::class, 'cancel'])->name('admin.bookings.cancel');
    Route::post('/admin/bookings/{reference_number}/delete', [BookingController::class, 'destroy'])->name('admin.bookings.destroy');
});