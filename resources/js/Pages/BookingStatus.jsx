// This page allows users to check the status of their booking by entering a reference number. 
// It displays the current status of the booking along with details and any notes from the admin team.

import PublicLayout from "../Layouts/PublicLayout";
import { useForm } from "@inertiajs/react";

// Configuration for different booking statuses, including colors, icons, titles and descriptions for display
const statusConfig = {
    pending: {
        color: "#854d0e",
        bg: "#fef9c3",
        border: "#fde68a",
        icon: "⏳",
        title: "Pending Confirmation",
        desc: "Your booking request has been received and is awaiting confirmation from our team. We will get back to you within 1–2 business days.",
    },
    confirmed: {
        color: "#065f46",
        bg: "#d1fae5",
        border: "#6ee7b7",
        icon: "✓",
        title: "Booking Confirmed",
        desc: "Your consultation has been confirmed! Please see the details below for your scheduled appointment.",
    },
    rescheduled: {
        color: "#1e40af",
        bg: "#dbeafe",
        border: "#93c5fd",
        icon: "📅",
        title: "Booking Rescheduled",
        desc: "Your consultation has been rescheduled. Please see the updated appointment details below.",
    },
    cancelled: {
        color: "#991b1b",
        bg: "#fee2e2",
        border: "#fca5a5",
        icon: "✕",
        title: "Booking Cancelled",
        desc: "Unfortunately your booking has been cancelled. Please contact us or submit a new booking request.",
    },
};

// DetailRow component renders a single row of booking details with a label and value, and is used within the booking details section of the page
function DetailRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
            <span className="text-gray-400 text-sm w-36 flex-shrink-0">
                {label}
            </span>
            <span className="text-gray-700 text-sm font-medium flex-1">
                {value}
            </span>
        </div>
    );
}

// The BookingStatus component renders the booking status page where users can enter their reference number to check the status of their consultation request. 
// It displays the current status along with booking details and any notes from the admin team.
export default function BookingStatus({ booking, searched }) {
    const { data, setData, post, processing } = useForm({
        reference_number: "",
    });

    // Handle form submission by sending a POST request to the /booking-status route with the entered reference number to retrieve booking details
    function submit(e) {
        e.preventDefault();
        post("/booking-status");
    }

    // Determine the status configuration based on the booking's current status, defaulting to "pending" if not found
    const status = booking
        ? (statusConfig[booking.status] ?? statusConfig.pending)
        : null;

    return (
        <PublicLayout>
        
            {/* Hero */}
            <section
                className="py-16 px-6 text-white text-center"
                style={{
                    background: "linear-gradient(135deg, #064e3b, #065f46)",
                }}
            >
                <h1 className="text-3xl font-bold mb-3">
                    Check Booking Status
                </h1>
                <p className="text-green-200 text-sm max-w-md mx-auto">
                    Enter your booking reference number to view the status of
                    your consultation request.
                </p>
            </section>

            {/* Search form */}
            <section className="px-6 py-12 bg-gray-50">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            Enter Reference Number
                        </h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Your reference number was sent to your email when
                            you submitted the booking form.
                        </p>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5">
                                    Reference Number
                                </label>
                                <input
                                    type="text"
                                    value={data.reference_number}
                                    onChange={(e) =>
                                        setData(
                                            "reference_number",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 font-mono"
                                    placeholder="e.g. a1b2c3d4-e5f6-..."
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1.5">
                                    The reference number looks like:
                                    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                                style={{ background: "#15803d" }}
                            >
                                {processing ? "Searching..." : "Check Status"}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    {searched && (
                        <div className="mt-6">
                            {!booking ? (

                                /* Not found */
                                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                        style={{ background: "#fee2e2" }}
                                    >
                                        <span style={{ fontSize: "28px" }}>
                                            🔍
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">
                                        Booking Not Found
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        No booking was found with that reference
                                        number. Please double-check the number
                                        from your confirmation email.
                                    </p>
                                    <a
                                        href="/contact"
                                        className="inline-block mt-6 px-6 py-2.5 rounded-full text-sm font-bold text-white"
                                        style={{ background: "#15803d" }}
                                    >
                                        Submit New Booking
                                    </a>
                                </div>
                            ) : (

                                /* Found */
                                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    
                                    {/* Status banner */}
                                    <div
                                        className="px-6 py-5 flex items-center gap-4"
                                        style={{
                                            background: status.bg,
                                            borderBottom: `1px solid ${status.border}`,
                                        }}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                                            style={{ background: "white" }}
                                        >
                                            {status.icon}
                                        </div>
                                        <div>
                                            <p
                                                className="font-bold text-base"
                                                style={{ color: status.color }}
                                            >
                                                {status.title}
                                            </p>
                                            <p
                                                className="text-sm mt-0.5"
                                                style={{
                                                    color: status.color,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {status.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Booking details */}
                                    <div className="px-6 py-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            Booking Details
                                        </p>
                                        <DetailRow
                                            label="Reference"
                                            value={booking.reference_number}
                                        />
                                        <DetailRow
                                            label="Name"
                                            value={booking.name}
                                        />
                                        <DetailRow
                                            label="Service"
                                            value={booking.service_type}
                                        />
                                        <DetailRow
                                            label="Preferred date"
                                            value={booking.preferred_date}
                                        />
                                        <DetailRow
                                            label="Preferred time"
                                            value={booking.preferred_time}
                                        />
                                        <DetailRow
                                            label="Type"
                                            value={booking.consultation_type}
                                        />
                                    </div>

                                    {/* Confirmed appointment */}
                                    {(booking.confirmed_date ||
                                        booking.confirmed_time) && (
                                        <div
                                            className="mx-6 mb-4 px-5 py-4 rounded-xl"
                                            style={{
                                                background: "#f0fdf4",
                                                border: "1px solid #bbf7d0",
                                            }}
                                        >
                                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                                                Confirmed Appointment
                                            </p>
                                            <p className="text-green-800 font-bold text-base">
                                                {booking.confirmed_date} at{" "}
                                                {booking.confirmed_time}
                                            </p>
                                        </div>
                                    )}

                                    {/* Admin note */}
                                    {booking.admin_response && (
                                        <div
                                            className="mx-6 mb-4 px-5 py-4 rounded-xl"
                                            style={{
                                                background: "#eff6ff",
                                                border: "1px solid #bfdbfe",
                                            }}
                                        >
                                            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                                                Note from Our Team
                                            </p>
                                            <p className="text-blue-800 text-sm leading-relaxed">
                                                {booking.admin_response}
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-xs text-gray-400">
                                            Need help? Contact us at
                                            info@jurukurvisi.com
                                        </p>
                                        <a
                                            href="/contact"
                                            className="text-xs font-bold px-4 py-2 rounded-full"
                                            style={{
                                                background: "#d1fae5",
                                                color: "#065f46",
                                            }}
                                        >
                                            New Booking
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
                <p>
                    © {new Date().getFullYear()} Jurukur Visi Sdn Bhd · Sungai
                    Buloh, Selangor
                </p>
                <p className="mt-1">
                    Tel: +603 1234 5678 · info@jurukurvisi.com
                </p>
            </footer>
        </PublicLayout>
    );
}
