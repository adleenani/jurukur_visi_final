<?php

namespace App\Http\Controllers;

use App\Models\ConsultationBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    // View all bookings
    public function index()
    {
        $bookings = ConsultationBooking::orderBy('created_at', 'desc')->get();

        $stats = [
            'total' => $bookings->count(),
            'pending' => $bookings->where('status', 'pending')->count(),
            'confirmed' => $bookings->where('status', 'confirmed')->count(),
            'cancelled' => $bookings->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Bookings/Index', compact('bookings', 'stats'));
    }

    // Confirm booking
    public function confirm(Request $request, $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'confirmed',
            'confirmed_date' => $request->confirmed_date,
            'confirmed_time' => $request->confirmed_time,
            'admin_response' => $request->admin_response,
        ]);

        return redirect()->route('admin.bookings')->with('success', 'Booking confirmed!');
    }

    public function reschedule(Request $request, $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'rescheduled',
            'confirmed_date' => $request->confirmed_date,
            'confirmed_time' => $request->confirmed_time,
            'admin_response' => $request->admin_response,
        ]);

        return redirect()->route('admin.bookings')->with('success', 'Booking rescheduled!');
    }

    public function cancel(Request $request, $reference_number)
    {
        $booking = ConsultationBooking::where('reference_number', $reference_number)->firstOrFail();

        $booking->update([
            'status' => 'cancelled',
            'admin_response' => $request->admin_response,
        ]);

        return redirect()->route('admin.bookings')->with('success', 'Booking cancelled.');
    }

    public function destroy($reference_number)
    {
        ConsultationBooking::where('reference_number', $reference_number)->firstOrFail()->delete();
        return redirect()->route('admin.bookings')->with('success', 'Booking deleted.');
    }
}