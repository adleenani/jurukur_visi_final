<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $stats = [
            'pending' => User::where('is_active', false)->where('role', 'pic')->count(),
            'approved' => User::where('is_active', true)->where('role', 'pic')->count(),
            'total' => User::where('role', 'pic')->count(),
        ];

        $users = User::where('role', 'pic')
            ->orderByRaw("CASE WHEN is_active = 0 THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Users/Index', compact('users', 'stats'));
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been approved successfully!");
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been rejected.");
    }
}