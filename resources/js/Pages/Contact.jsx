import PublicLayout from "../Layouts/PublicLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

const services = [
    "Consultant and Survey Services in Cadastral",
    "Strata Title",
    "Topographic Hydrographic",
    "Engineering and Mapping",
    "Mining",
    "Aerial",
    "M.Tech",
    "GPS",
    "Land & Housing Development",
    "Underground Utilities Detection and Mapping",
];

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
];

const statusConfig = {
    pending: {
        color: "#854d0e",
        bg: "#fef9c3",
        icon: "⏳",
        title: "Pending Confirmation",
        desc: "Your booking request has been received and is awaiting confirmation from our team. We will get back to you within 1–2 business days.",
    },
    confirmed: {
        color: "#065f46",
        bg: "#d1fae5",
        icon: "✓",
        title: "Booking Confirmed",
        desc: "Your consultation has been confirmed! Please see the details below for your scheduled appointment.",
    },
    rescheduled: {
        color: "#1e40af",
        bg: "#dbeafe",
        icon: "📅",
        title: "Booking Rescheduled",
        desc: "Your consultation has been rescheduled. Please see the updated appointment details below.",
    },
    cancelled: {
        color: "#991b1b",
        bg: "#fee2e2",
        icon: "✕",
        title: "Booking Cancelled",
        desc: "Unfortunately your booking has been cancelled. Please contact us or submit a new booking.",
    },
};

function DetailRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
            <span
                className="text-gray-400 flex-shrink-0"
                style={{ fontSize: "11px", width: "90px" }}
            >
                {label}
            </span>
            <span
                className="text-gray-700 font-medium flex-1"
                style={{ fontSize: "11px", wordBreak: "break-word" }}
            >
                {value}
            </span>
        </div>
    );
}

export default function Contact() {
    const { props } = usePage();
    const flash = props.flash ?? {};

    // Booking form
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        service_type: "",
        preferred_date: "",
        preferred_time: "",
        consultation_type: "online",
        message: "",
    });

    function submitBooking(e) {
        e.preventDefault();
        post("/contact", { onSuccess: () => reset() });
    }

    // Check booking popup
    const [showPopup, setShowPopup] = useState(false);
    const [refNumber, setRefNumber] = useState("");
    const [checking, setChecking] = useState(false);
    const [searched, setSearched] = useState(false);
    const [foundBooking, setFoundBooking] = useState(null);

    function openPopup() {
        setShowPopup(true);
        setSearched(false);
        setFoundBooking(null);
        setRefNumber("");
    }

    function closePopup() {
        setShowPopup(false);
        setSearched(false);
        setFoundBooking(null);
        setRefNumber("");
    }

    async function checkBooking(e) {
        e.preventDefault();
        if (!refNumber.trim()) return;
        setChecking(true);
        try {
            const res = await axios.post("/check-booking", {
                reference_number: refNumber,
            });
            setFoundBooking(res.data.found ? res.data.booking : null);
            setSearched(true);
        } catch {
            setSearched(true);
            setFoundBooking(null);
        } finally {
            setChecking(false);
        }
    }

    const status = foundBooking
        ? (statusConfig[foundBooking.status] ?? statusConfig.pending)
        : null;

    return (
        <PublicLayout>
            <section className="px-6 py-6 bg-gray-50 pt-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                        Book a Consultation
                    </h1>
                    <p className="text-gray-500 mb-8 text-sm">
                        Fill in the form below and our team will confirm your
                        appointment within 1–2 business days.
                    </p>

                    {/* Main split layout */}
                    <section className="grid gap-6 mb-5">
                        <div className="max-w-6xl mx-auto">
                            <div
                                className="grid gap-6"
                                style={{ gridTemplateColumns: "3fr 1fr" }}
                            >
                                {/* Left — Booking form (existing, unchanged) */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                                        Consultation Request
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-6">
                                        All fields are required unless stated
                                        optional.
                                    </p>

                                    {flash.success && (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl mb-6 text-sm">
                                            {flash.success}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={submitBooking}
                                        className="space-y-4"
                                    >
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    placeholder="Your full name"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    placeholder="+60 12 345 6789"
                                                    required
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Service Required
                                                </label>
                                                <select
                                                    value={data.service_type}
                                                    onChange={(e) =>
                                                        setData(
                                                            "service_type",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    required
                                                >
                                                    <option value="">
                                                        -- Select a service --
                                                    </option>
                                                    {services.map((s) => (
                                                        <option
                                                            key={s}
                                                            value={s}
                                                        >
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.service_type && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.service_type}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Preferred Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.preferred_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "preferred_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    required
                                                />
                                                {errors.preferred_date && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.preferred_date}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Preferred Time
                                                </label>
                                                <select
                                                    value={data.preferred_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            "preferred_time",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                                    required
                                                >
                                                    <option value="">
                                                        -- Select a time --
                                                    </option>
                                                    {timeSlots.map((t) => (
                                                        <option
                                                            key={t}
                                                            value={t}
                                                        >
                                                            {t}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.preferred_time && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.preferred_time}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">
                                                Consultation Type
                                            </label>
                                            <div className="flex gap-4">
                                                {["online", "in-person"].map(
                                                    (type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                value={type}
                                                                checked={
                                                                    data.consultation_type ===
                                                                    type
                                                                }
                                                                onChange={() =>
                                                                    setData(
                                                                        "consultation_type",
                                                                        type,
                                                                    )
                                                                }
                                                                className="accent-green-700"
                                                            />
                                                            <span className="text-sm text-gray-600 capitalize">
                                                                {type}
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Additional Message (optional)
                                            </label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        "message",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={3}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                                                placeholder="Tell us more about your project or requirements..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-green-700 text-white py-3 rounded-lg text-sm font-bold hover:bg-green-800 transition disabled:opacity-50"
                                        >
                                            {processing
                                                ? "Submitting..."
                                                : "Submit Booking Request"}
                                        </button>
                                    </form>
                                </div>

                                {/* Right — Check booking panel */}
                                <div
                                    className="rounded-2xl border flex flex-col items-center justify-center text-center p-6"
                                    style={{
                                        background: "#f0fdf4",
                                        borderColor: "#bbf7d0",
                                    }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-2xl"
                                        style={{ background: "#d1fae5" }}
                                    >
                                        📋
                                    </div>
                                    <h3
                                        className="font-bold text-green-900 mb-2"
                                        style={{
                                            fontSize: "14px",
                                            lineHeight: "1.4",
                                        }}
                                    >
                                        Already have a booking?
                                    </h3>
                                    <p
                                        className="text-gray-500 mb-6"
                                        style={{
                                            fontSize: "11px",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        Check the status of your existing
                                        consultation request using your
                                        reference number.
                                    </p>
                                    <button
                                        onClick={openPopup}
                                        className="w-full py-2.5 rounded-xl font-bold text-white transition hover:opacity-90"
                                        style={{
                                            background: "#064e3b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Check My Booking →
                                    </button>
                                    <div className="w-8 h-px bg-green-200 my-3" />
                                    <p
                                        className="text-gray-400"
                                        style={{
                                            fontSize: "10px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        Your reference number was sent to your
                                        email after submitting a booking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    {/* <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm rounded-t-2xl">
                <p>
                    © {new Date().getFullYear()} Jurukur Visi Sdn Bhd · Sungai
                    Buloh, Selangor
                </p>
                <p className="mt-1">
                    Tel: +603 1234 5678 · info@jurukurvisi.com
                </p>
            </footer> */}

                    {/* Check Booking Popup */}
                    {showPopup && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style={{ background: "rgba(0,0,0,0.4)" }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closePopup();
                            }}
                        >
                            <div
                                className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-gray-100"
                                style={{
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                }}
                            >
                                {/* Popup header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <p className="font-bold text-gray-800">
                                        {searched
                                            ? "Booking Status"
                                            : "Check Booking Status"}
                                    </p>
                                    <button
                                        onClick={closePopup}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
                                        style={{ fontSize: "12px" }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Popup body */}
                                <div className="px-5 py-5">
                                    {/* State 1 — Search form */}
                                    {!searched && (
                                        <>
                                            <p
                                                className="text-gray-500 mb-4"
                                                style={{
                                                    fontSize: "12px",
                                                    lineHeight: "1.6",
                                                }}
                                            >
                                                Enter your booking reference
                                                number below. It was sent to
                                                your email when you submitted
                                                the consultation form.
                                            </p>
                                            <form
                                                onSubmit={checkBooking}
                                                className="space-y-3"
                                            >
                                                <input
                                                    type="text"
                                                    value={refNumber}
                                                    onChange={(e) =>
                                                        setRefNumber(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
                                                    style={{
                                                        fontSize: "12px",
                                                        fontFamily: "monospace",
                                                    }}
                                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                                    required
                                                    autoFocus
                                                />
                                                <p
                                                    className="text-gray-400"
                                                    style={{ fontSize: "10px" }}
                                                >
                                                    Format:
                                                    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                                                </p>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        checking ||
                                                        !refNumber.trim()
                                                    }
                                                    className="w-full py-2.5 rounded-xl font-bold text-white transition disabled:opacity-50"
                                                    style={{
                                                        background: "#064e3b",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {checking
                                                        ? "Searching..."
                                                        : "Check Status →"}
                                                </button>
                                            </form>
                                        </>
                                    )}

                                    {/* State 2 — Not found */}
                                    {searched && !foundBooking && (
                                        <div className="text-center py-4">
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                                                style={{
                                                    background: "#fee2e2",
                                                }}
                                            >
                                                🔍
                                            </div>
                                            <h3 className="font-bold text-gray-800 mb-2">
                                                Booking Not Found
                                            </h3>
                                            <p
                                                className="text-gray-400 mb-6"
                                                style={{
                                                    fontSize: "12px",
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                No booking was found with that
                                                reference number. Please
                                                double-check the number from
                                                your confirmation email.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSearched(false);
                                                    setRefNumber("");
                                                }}
                                                className="w-full py-2.5 rounded-xl font-bold text-white transition"
                                                style={{
                                                    background: "#064e3b",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    )}

                                    {/* State 3 — Found */}
                                    {searched && foundBooking && status && (
                                        <>
                                            {/* Status banner */}
                                            <div
                                                className="flex items-start gap-3 p-3 rounded-xl mb-4"
                                                style={{
                                                    background: status.bg,
                                                }}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                                                    style={{
                                                        background: "white",
                                                    }}
                                                >
                                                    {status.icon}
                                                </div>
                                                <div>
                                                    <p
                                                        className="font-bold"
                                                        style={{
                                                            fontSize: "12px",
                                                            color: status.color,
                                                        }}
                                                    >
                                                        {status.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "10px",
                                                            color: status.color,
                                                            opacity: 0.85,
                                                            marginTop: "2px",
                                                            lineHeight: "1.4",
                                                        }}
                                                    >
                                                        {status.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Booking details */}
                                            <div className="mb-3">
                                                <DetailRow
                                                    label="Name"
                                                    value={foundBooking.name}
                                                />
                                                <DetailRow
                                                    label="Service"
                                                    value={
                                                        foundBooking.service_type
                                                    }
                                                />
                                                <DetailRow
                                                    label="Pref. Date"
                                                    value={
                                                        foundBooking.preferred_date
                                                    }
                                                />
                                                <DetailRow
                                                    label="Pref. Time"
                                                    value={
                                                        foundBooking.preferred_time
                                                    }
                                                />
                                                <DetailRow
                                                    label="Type"
                                                    value={
                                                        foundBooking.consultation_type
                                                    }
                                                />
                                                <DetailRow
                                                    label="Reference"
                                                    value={
                                                        foundBooking.reference_number?.slice(
                                                            0,
                                                            18,
                                                        ) + "..."
                                                    }
                                                />
                                            </div>

                                            {/* Confirmed appointment */}
                                            {foundBooking.confirmed_date && (
                                                <div
                                                    className="p-3 rounded-xl mb-3"
                                                    style={{
                                                        background: "#f0fdf4",
                                                        border: "0.5px solid #bbf7d0",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: "9px",
                                                            fontWeight: 700,
                                                            color: "#15803d",
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                "0.05em",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        ✓ Confirmed Appointment
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: 800,
                                                            color: "#064e3b",
                                                        }}
                                                    >
                                                        {
                                                            foundBooking.confirmed_date
                                                        }{" "}
                                                        at{" "}
                                                        {
                                                            foundBooking.confirmed_time
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Admin note */}
                                            {foundBooking.admin_response && (
                                                <div
                                                    className="p-3 rounded-xl mb-3"
                                                    style={{
                                                        background: "#eff6ff",
                                                        border: "0.5px solid #bfdbfe",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: "9px",
                                                            fontWeight: 700,
                                                            color: "#1d4ed8",
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                "0.05em",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Note from our team
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#1e40af",
                                                            lineHeight: "1.5",
                                                        }}
                                                    >
                                                        {
                                                            foundBooking.admin_response
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Try another */}
                                            <button
                                                onClick={() => {
                                                    setSearched(false);
                                                    setRefNumber("");
                                                    setFoundBooking(null);
                                                }}
                                                className="text-green-700 hover:underline"
                                                style={{ fontSize: "11px" }}
                                            >
                                                ← Check another booking
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Popup footer */}
                                {searched && foundBooking && (
                                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                        <p
                                            style={{
                                                fontSize: "10px",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            Need help? info@jurukurvisi.com
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={closePopup}
                                                className="font-bold"
                                                style={{
                                                    fontSize: "10px",
                                                    background: "#d1fae5",
                                                    color: "#065f46",
                                                    padding: "5px 12px",
                                                    borderRadius: "99px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
