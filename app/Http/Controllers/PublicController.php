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
            'projects' => Project::count(),
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
            'name' => 'required|string|min:2|max:100|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email:rfc,dns|max:100',
            'phone' => 'required|string|max:20|regex:/^[0-9\+\-\s\(\)]+$/',
            'service_type' => 'required|string|max:100',
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'required|string|in:9:00 AM,10:00 AM,11:00 AM,2:00 PM,3:00 PM,4:00 PM',
            'consultation_type' => 'required|string|in:online,in-person',
            'message' => 'nullable|string|max:1000',
        ]);

        $referenceNumber = (string) \Illuminate\Support\Str::uuid();

        ConsultationBooking::create([
            'reference_number' => $referenceNumber,
            'name' => strip_tags($request->name),
            'email' => $request->email,
            'phone' => strip_tags($request->phone),
            'service_type' => $request->service_type,
            'preferred_date' => $request->preferred_date,
            'preferred_time' => $request->preferred_time,
            'consultation_type' => $request->consultation_type,
            'message' => strip_tags($request->message),
            'status' => 'pending',
        ]);

        return back()->with('success', "Booking submitted! Your reference number is: {$referenceNumber} — save this to check your booking status.");
    }

    public function bookingStatus()
    {
        return Inertia::render('BookingStatus', [
            'booking' => null,
            'searched' => false,
        ]);
    }

    public function checkBookingStatus(Request $request)
    {
        $request->validate([
            'reference_number' => 'required|string|max:100',
        ]);

        $booking = ConsultationBooking::where(
            'reference_number',
            strip_tags($request->reference_number)
        )->first();

        return Inertia::render('BookingStatus', [
            'booking' => $booking,
            'searched' => true,
        ]);
    }
}