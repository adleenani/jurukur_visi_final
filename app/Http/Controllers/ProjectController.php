<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Dashboard
    public function dashboard()
    {
        $stats = [
            'total' => Project::count(),
            'recent' => Project::orderBy('created_at', 'desc')->take(5)->get(),
            'pending_bookings' => \App\Models\ConsultationBooking::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Dashboard', compact('stats'));
    }

    // Project list
    public function index()
    {
        $projects = Project::orderBy('project_start', 'desc')->get();
        return Inertia::render('Admin/Projects/Index', compact('projects'));
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    // Store new project
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|max:20|unique:projects,project_id',
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
        $project = Project::where('project_id', $project_id)->firstOrFail();
        return Inertia::render('Admin/Projects/Edit', compact('project'));
    }

    // Update project
    public function update(Request $request, $project_id)
    {
        $project = Project::where('project_id', $project_id)->firstOrFail();

        $request->validate([
            'project_name' => 'required|max:100',
            'project_start' => 'required|date',
            'project_end' => 'required|date|after_or_equal:project_start',
            'project_location' => 'required|max:100',
            'project_services' => 'required|max:100',
            'project_description' => 'nullable|max:500',
        ]);

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