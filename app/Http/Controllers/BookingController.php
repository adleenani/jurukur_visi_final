<?php

// The BookingController manages consultation bookings, allowing admins/PICs to view, confirm, reschedule, cancel, and delete bookings. 
// It also handles sending email notifications to clients when their booking status changes.

namespace App\Http\Controllers;

use App\Models\ConsultationBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Queue;

// Controller for managing consultation bookings (PIC).
class BookingController extends Controller
{
    // List all bookings with filters and pagination.
    public function index(Request $request)
    {
        $query = ConsultationBooking::orderBy('created_at', 'desc');

        // Apply filters
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply search filter across multiple fields.
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('reference_number', 'like', "%{$request->search}%")
                    ->orWhere('service_type', 'like', "%{$request->search}%");
            });
        }

        $bookings = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => ConsultationBooking::count(),
            'pending' => ConsultationBooking::where('status', 'pending')->count(),
            'confirmed' => ConsultationBooking::where('status', 'confirmed')->count(),
            'rescheduled' => ConsultationBooking::where('status', 'rescheduled')->count(),
            'cancelled' => ConsultationBooking::where('status', 'cancelled')->count(),
        ];

        // Pass bookings, stats, and current filters to the view.
        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    // Show details of a specific booking.
    public function show(string $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();
        return Inertia::render('Admin/Bookings/Show', compact('booking'));
    }

    // Confirm a booking.
    public function confirm(Request $request, string $reference_number)
    {
        $request->validate([
            'confirmed_date' => 'required|date',
            'confirmed_time' => 'required',
            'admin_response' => 'nullable|max:500',
        ]);

        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'confirmed',
            'confirmed_date' => $request->confirmed_date,
            'confirmed_time' => $request->confirmed_time,
            'admin_response' => $request->admin_response,
        ]);

        // Send confirmation email to client.
        try {
            Mail::raw(
                "Dear {$booking->name},\n\n" .
                "Great news! Your consultation booking with Jurukur Visi Sdn Bhd has been CONFIRMED.\n\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "APPOINTMENT DETAILS\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "Reference No : {$booking->reference_number}\n" .
                "Service      : {$booking->service_type}\n" .
                "Date         : {$request->confirmed_date}\n" .
                "Time         : {$request->confirmed_time}\n" .
                "Type         : {$booking->consultation_type}\n" .
                ($request->admin_response ? "\nNote from our team:\n{$request->admin_response}\n" : '') .
                "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" .
                "Please arrive on time. If you need to reschedule, contact us as soon as possible.\n\n" .
                "You can check your booking status anytime at our website using your reference number.\n\n" .
                "Thank you for choosing Jurukur Visi Sdn Bhd.\n\n" .
                "Best regards,\n" .
                "Jurukur Visi Sdn Bhd\n" .
                "Tel: +603-6038 8523\n" .
                "Fax: +603-6038 8524\n" .
                "Email: info@jurukurvisi.com\n" .
                "No 39-1, Jalan Bidara 10, Bandar Saujana Utama, 47000 Sungai Buloh, Selangor.",
                function ($message) use ($booking) {

                    // Set the recipient and subject of the confirmation email.
                    $message->to($booking->email, $booking->name)
                        ->subject('Booking Confirmed — Jurukur Visi Sdn Bhd');
                }
            );
        } catch (\Exception $e) {
            Log::error('Booking confirm email failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.bookings')
            ->with('success', "Booking confirmed! Email notification sent to {$booking->email}.");
    }

    // Reschedule a booking
    public function reschedule(Request $request, string $reference_number)
    {
        $request->validate([
            'confirmed_date' => 'required|date',
            'confirmed_time' => 'required',
            'admin_response' => 'nullable|max:500',
        ]);

        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'rescheduled',
            'confirmed_date' => $request->confirmed_date,
            'confirmed_time' => $request->confirmed_time,
            'admin_response' => $request->admin_response,
        ]);

        // Send reschedule email to client.
        try {
            Mail::raw(
                "Dear {$booking->name},\n\n" .
                "Your consultation booking with Jurukur Visi Sdn Bhd has been RESCHEDULED.\n\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "UPDATED APPOINTMENT DETAILS\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "Reference No  : {$booking->reference_number}\n" .
                "Service       : {$booking->service_type}\n" .
                "New Date      : {$request->confirmed_date}\n" .
                "New Time      : {$request->confirmed_time}\n" .
                "Type          : {$booking->consultation_type}\n" .
                ($request->admin_response ? "\nReason for rescheduling:\n{$request->admin_response}\n" : '') .
                "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" .
                "We apologise for any inconvenience caused. Please confirm your availability for the new date.\n\n" .
                "If this new time does not suit you, please contact us immediately.\n\n" .
                "You can check your booking status anytime at our website using your reference number.\n\n" .
                "Thank you for your understanding.\n\n" .
                "Best regards,\n" .
                "Jurukur Visi Sdn Bhd\n" .
                "Tel: +603-6038 8523\n" .
                "Fax: +603-6038 8524\n" .
                "Email: info@jurukurvisi.com\n" .
                "No 39-1, Jalan Bidara 10, Bandar Saujana Utama, 47000 Sungai Buloh, Selangor.",
                function ($message) use ($booking) {

                    // Set the recipient and subject of the reschedule email.
                    $message->to($booking->email, $booking->name)
                        ->subject('Booking Rescheduled — Jurukur Visi Sdn Bhd');
                }
            );
        } catch (\Exception $e) {
            Log::error('Booking reschedule email failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.bookings')
            ->with('success', "Booking rescheduled! Email notification sent to {$booking->email}.");
    }

    // Cancel a booking.
    public function cancel(Request $request, string $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'cancelled',
            'admin_response' => $request->admin_response,
        ]);

        // Send cancellation email to client
        try {
            Mail::raw(
                "Dear {$booking->name},\n\n" .
                "We regret to inform you that your consultation booking with Jurukur Visi Sdn Bhd has been CANCELLED.\n\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "CANCELLED BOOKING DETAILS\n" .
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                "Reference No : {$booking->reference_number}\n" .
                "Service      : {$booking->service_type}\n" .
                "Preferred Date : {$booking->preferred_date}\n" .
                "Preferred Time : {$booking->preferred_time}\n" .
                ($request->admin_response ? "\nReason for cancellation:\n{$request->admin_response}\n" : '') .
                "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" .
                "We apologise for any inconvenience this may have caused.\n\n" .
                "If you would like to make a new booking, please visit our website or contact us directly.\n\n" .
                "Thank you for your understanding.\n\n" .
                "Best regards,\n" .
                "Jurukur Visi Sdn Bhd\n" .
                "Tel: +603-6038 8523\n" .
                "Fax: +603-6038 8524\n" .
                "Email: info@jurukurvisi.com\n" .
                "No 39-1, Jalan Bidara 10, Bandar Saujana Utama, 47000 Sungai Buloh, Selangor.",
                function ($message) use ($booking) {

                    // Set the recipient and subject of the cancellation email.
                    $message->to($booking->email, $booking->name)
                        ->subject('✕ Booking Cancelled — Jurukur Visi Sdn Bhd');
                }
            );
        } catch (\Exception $e) {
            Log::error('Booking cancel email failed: ' . $e->getMessage());
        }

        return redirect()->route('admin.bookings')
            ->with('success', "Booking cancelled. Email notification sent to {$booking->email}.");
    }

    // Delete a booking.
    public function destroy(string $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();
        $booking->delete();

        return redirect()->route('admin.bookings')
            ->with('success', 'Booking deleted successfully.');
    }
}