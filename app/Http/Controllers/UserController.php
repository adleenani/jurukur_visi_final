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
            'total' => User::where('role', 'pic')->count(),
            'active' => User::where('role', 'pic')->where('is_active', true)->count(),
            'inactive' => User::where('role', 'pic')->where('is_active', false)->count(),
        ];

        $users = User::where('role', 'pic')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Users/Index', compact('users', 'stats'));
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
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

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been activated.");
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);

        return redirect()->route('admin.users')
            ->with('success', "{$user->full_name} has been deactivated.");
    }

    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'password' => [
                'required',
                'min:14',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'password' => password_hash($request->password, PASSWORD_ARGON2ID),
        ]);

        return redirect()->route('admin.users')
            ->with('success', "Password for {$user->full_name} has been reset.");
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $name = $user->full_name;
        $user->delete();

        return redirect()->route('admin.users')
            ->with('success', "{$name}'s account has been deleted.");
    }
}