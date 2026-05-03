<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ConsultationBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

// Controller for public-facing pages (home, projects, contact, booking status).
class PublicController extends Controller
{
    // Home page.
    public function home()
    {
        // Gather stats for home page
        $stats = [
            'projects' => Project::count(),
        ];

        return Inertia::render('Home', compact('stats'));
    }

    // About page.
    public function about()
    {
        $stats = [
            'projects' => Project::count(),
        ];

        return Inertia::render('About', compact('stats'));
    }

    // Projects page.
    public function projects()
    {
        // Fetch all projects ordered by start date descending
        $projects = Project::orderBy('project_start', 'desc')->get();
        return Inertia::render('Projects', compact('projects'));
    }

    // Contact page.
    public function contact()
    {
        return Inertia::render('BookingConsultation');
    }

    // Handle contact form submission (booking request).
    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:100|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email|max:100',
            'phone' => 'required|string|max:20|regex:/^[0-9\+\-\s\(\)]+$/',
            'service_type' => 'required|string|max:100',
            'preferred_date' => 'required|date|after:today',
            'consultation_type' => 'required|string|in:online,in-person',
            'message' => 'nullable|string|max:1000',
        ]);

        $referenceNumber = (string) \Illuminate\Support\Str::uuid();

        $name = strip_tags($request->name);
        $email = $request->email;

        ConsultationBooking::create([
            'reference_number' => $referenceNumber,
            'name' => strip_tags($request->name),
            'company_name' => strip_tags($request->company_name ?? ''),
            'email' => $request->email,
            'phone' => strip_tags($request->phone),
            'service_type' => $request->service_type,
            'preferred_date' => $request->preferred_date,
            'consultation_type' => 'in-person',
            'message' => strip_tags($request->message),
            'status' => 'pending',
        ]);

        // Send confirmation email to client
        try {
            Mail::raw(
                "Dear {$name},\n\n" .
                "Thank you for submitting your consultation request with Jurukur Visi Sdn Bhd!\n\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "BOOKING DETAILS\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "Reference No   : {$referenceNumber}\n" .
                "Company        : " . ($request->company_name ? strip_tags($request->company_name) : 'N/A') . "\n" .
                "Service            : {$request->service_type}\n" .
                "Preferred Date : {$request->preferred_date}\n" .
                "Type               : {$request->consultation_type}" .
                "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" .
                "Please save your reference number — you will need it to check your booking status.\n\n" .
                "Our team will review your request and confirm your appointment within 1-2 business days.\n\n" .
                "Thank you for choosing Jurukur Visi Sdn Bhd.\n\n" .
                "Best regards,\n" .
                "Jurukur Visi Sdn Bhd\n" .
                "Tel: +603 1234 5678\n" .
                "Email: info@jurukurvisi.com\n" .
                "Addr : No 39-1, Jalan Bidara 10, Bandar Saujana Utama, 47000 Sungai Buloh, Selangor.\n\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "This is an automated email. Please do not reply.\n" .
                "© " . date('Y') . " Jurukur Visi Sdn Bhd. All rights reserved.\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "CONFIDENTIALITY NOTICE: This email is intended solely for the named recipient. " .
                "If received in error, please notify us and delete it immediately. " .
                "Unauthorised use or distribution is strictly prohibited.\n",

                function ($message) use ($email, $name, $referenceNumber) {
                    $message->to($email, $name)
                        ->subject('Booking Received — Jurukur Visi Sdn Bhd [Ref: ' . substr($referenceNumber, 0, 8) . ']');
                }

            );
        } catch (\Exception $e) {
            Log::error('Booking confirmation email failed: ' . $e->getMessage());
        }

        return back()->with(
            'success',
            "Booking submitted! Your reference number is: {$referenceNumber} — save this to check your booking status."
        );
    }

    // Booking status page.
    public function bookingStatus()
    {
        return Inertia::render('BookingStatus', [
            'booking' => null,
            'searched' => false,
        ]);
    }

    // Check booking status via AJAX.
    public function checkBookingStatus(Request $request)
    {
        $request->validate([
            'reference_number' => 'required|string|max:100',
        ]);

        $booking = ConsultationBooking::where(
            'reference_number',
            strip_tags($request->reference_number)
        )->first();

        return response()->json([
            'found' => $booking !== null,
            'booking' => $booking,
        ]);
    }
}