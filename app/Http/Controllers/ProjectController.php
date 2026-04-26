<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Controller for managing projects (admin/PIC)
class ProjectController extends Controller
{
    // Dashboard
    public function dashboard()
    {
        // Gather stats for dashboard
        $stats = [
            'total' => Project::count(),
            'recent' => Project::orderBy('created_at', 'desc')->take(5)->get(),
            'pending_bookings' => \App\Models\ConsultationBooking::where('status', 'pending')->count(),
            'total_bookings' => \App\Models\ConsultationBooking::count(),
            'pending_booking_list' => \App\Models\ConsultationBooking::where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
            'total_users' => \App\Models\User::where('role', 'pic')->count(),
        ];

        return Inertia::render('Admin/Dashboard', compact('stats'));
    }

    // Project list
    public function index(Request $request)
    {
        // Fetch projects with optional search filter and pagination
        $query = Project::orderBy('created_at', 'desc');

        // Apply search filter across multiple fields
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('project_name', 'like', "%{$request->search}%")
                    ->orWhere('project_id', 'like', "%{$request->search}%")
                    ->orWhere('project_location', 'like', "%{$request->search}%")
                    ->orWhere('project_services', 'like', "%{$request->search}%");
            });
        }

        // Paginate results and maintain query string for filters
        $projects = $query->paginate(10)->withQueryString();

        // Pass projects and current filters to the view
        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['search']),
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    // Store new project
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'project_id' => 'required|max:20|alpha_num|unique:projects,project_id',
            'project_name' => 'required|string|max:100',
            'project_start' => 'required|date',
            'project_end' => 'required|date|after_or_equal:project_start',
            'project_location' => 'required|string|max:100',
            'project_services' => 'required|string|max:100',
            'project_description' => 'nullable|string|max:500',
        ]);

        // Calculate duration automatically
        $start = new \DateTime($request->project_start);
        $end = new \DateTime($request->project_end);
        $interval = $start->diff($end);
        $duration = '';
        if ($interval->y > 0)
            $duration .= $interval->y . ' Year(s), ';
        if ($interval->m > 0)
            $duration .= $interval->m . ' Month(s), ';
        $duration .= $interval->d . ' Day(s)';

        // Create project with created_by set to current user ID from session
        Project::create([
            'project_id' => strtoupper($request->project_id),
            'project_name' => $request->project_name,
            'project_start' => $request->project_start,
            'project_end' => $request->project_end,
            'project_location' => $request->project_location,
            'project_duration' => $duration,
            'project_services' => $request->project_services,
            'project_description' => $request->project_description,
            'created_by' => session('user_id'),
        ]);

        return redirect()->route('admin.projects')
            ->with('success', 'Project added successfully!');
    }

    // Show edit form
    public function edit($project_id)
    {
        // Find project by project_id (not ID) and pass to view
        $project = Project::where('project_id', $project_id)->firstOrFail();
        return Inertia::render('Admin/Projects/Edit', compact('project'));
    }

    // Update project
    public function update(Request $request, $project_id)
    {
        $project = Project::where('project_id', $project_id)->firstOrFail();

        // Validate input
        $request->validate([
            'project_name' => 'required|max:100',
            'project_start' => 'required|date',
            'project_end' => 'required|date|after_or_equal:project_start',
            'project_location' => 'required|max:100',
            'project_services' => 'required|max:100',
            'project_description' => 'nullable|max:500',
        ]);

        // Calculate duration automatically
        $start = new \DateTime($request->project_start);
        $end = new \DateTime($request->project_end);
        $interval = $start->diff($end);
        $duration = '';
        if ($interval->y > 0)
            $duration .= $interval->y . ' Year(s), ';
        if ($interval->m > 0)
            $duration .= $interval->m . ' Month(s), ';
        $duration .= $interval->d . ' Day(s)';

        $project->update([
            'project_name' => $request->project_name,
            'project_start' => $request->project_start,
            'project_end' => $request->project_end,
            'project_location' => $request->project_location,
            'project_duration' => $duration,
            'project_services' => $request->project_services,
            'project_description' => $request->project_description,
        ]);

        return redirect()->route('admin.projects')
            ->with('success', 'Project updated successfully!');
    }

    // Delete project
    public function destroy($project_id)
    {
        $project = Project::where('project_id', $project_id)->firstOrFail();
        $project->delete();

        return redirect()->route('admin.projects')
            ->with('success', 'Project deleted successfully!');
    }
}