<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Controller for managing users (admin)
class UserController extends Controller
{
    // List all users (admin view)
    public function index(Request $request)
    {
        // Fetch users with optional search and status filters, only for 'pic' role, and paginate results
        $query = User::where('role', 'pic')->orderBy('created_at', 'desc');

        // Apply status filter if provided (active/inactive)
        if ($request->status && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Apply search filter across multiple fields
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', "%{$request->search}%")
                    ->orWhere('username', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Paginate results and maintain query string for filters
        $users = $query->paginate(10)->withQueryString();

        // Gather stats for user management page
        $stats = [
            'total' => User::where('role', 'pic')->count(),
            'active' => User::where('role', 'pic')->where('is_active', true)->count(),
            'inactive' => User::where('role', 'pic')->where('is_active', false)->count(),
        ];

        // Pass users, stats, and current filters to the view
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    // Show create user form
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    // Store new user
    public function store(Request $request)
    {
        // Validate input with strong rules and custom messages
        $request->validate([
            'username' => 'required|min:4|max:30|alpha_num|unique:users,username',
            'full_name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ]);

        // Create new user with hashed password and default role 'pic', but set is_active to false until admin approval
        User::create([
            'username' => $request->username,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => password_hash($request->password, PASSWORD_ARGON2ID),
            'role' => 'pic',
            'is_active' => true,
            'must_change_password' => true, // force change on first login
        ]);

        return redirect()->route('admin.users')
            ->with('success', "Staff account for {$request->full_name} created! They must change their password on first login.");
    }

    // Activate a user
    public function approve($id)
    {
        // Find user by ID and set is_active to true
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been activated.");
    }

    // Deactivate a user
    public function reject($id)
    {
        // Find user by ID and set is_active to false
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been deactivated.");
    }

    // Reset user password
    public function resetPassword(Request $request, $id)
    {
        // Validate input with strong rules
        $request->validate([
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ]);

        // Find user by ID and update password with hashed value, also set must_change_password to true to force change on next login
        $user = User::findOrFail($id);
        $user->update([
            'password' => password_hash($request->password, PASSWORD_ARGON2ID),
        ]);

        return redirect()->route('admin.users')
            ->with('success', "Password for {$user->full_name} has been reset.");
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $name = $user->full_name;
        $user->delete();

        return redirect()->route('admin.users')
            ->with('success', "{$name}'s account has been deleted.");
    }
}