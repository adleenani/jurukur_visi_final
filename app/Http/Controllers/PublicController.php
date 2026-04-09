<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ConsultationBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
{
    $stats = [
        'projects'  => Project::count(),
    ];

    return Inertia::render('Home', compact('stats'));
}

    public function projects()
    {
        $projects = Project::orderBy('project_start', 'desc')->get();
        return Inertia::render('Projects', compact('projects'));
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name'              => 'required|max:100',
            'email'             => 'required|email|max:100',
            'phone'             => 'required|max:20',
            'service_type'      => 'required|max:100',
            'preferred_date'    => 'required|date|after:today',
            'preferred_time'    => 'required',
            'consultation_type' => 'required',
            'message'           => 'nullable|max:1000',
        ]);

        ConsultationBooking::create([
            'reference_number'  => (string) \Illuminate\Support\Str::uuid(),
            'name'              => $request->name,
            'email'             => $request->email,
            'phone'             => $request->phone,
            'service_type'      => $request->service_type,
            'preferred_date'    => $request->preferred_date,
            'preferred_time'    => $request->preferred_time,
            'consultation_type' => $request->consultation_type,
            'message'           => $request->message,
            'status'            => 'pending',
        ]);

        return back()->with('success', 'Booking submitted! We will confirm your appointment within 1-2 business days. Check your email for updates.');
    }
}