import AdminLayout from "../../../Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

const statusStyle = {
    pending: { bg: "#fef9c3", text: "#854d0e" },
    confirmed: { bg: "#dcfce7", text: "#166534" },
    rescheduled: { bg: "#dbeafe", text: "#1e40af" },
    cancelled: { bg: "#fee2e2", text: "#991b1b" },
};

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
];

function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function Index({ bookings, stats }) {
    const { flash } = usePage().props;
    const [filter, setFilter] = useState("all");
    const [modal, setModal] = useState(null);
    const [action, setAction] = useState("confirm");
    const [form, setForm] = useState({
        confirmed_date: "",
        confirmed_time: "",
        admin_response: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const filtered =
        filter === "all"
            ? bookings
            : bookings.filter((b) => b.status === filter);

    function openModal(booking) {
        setModal(booking);
        setAction("confirm");
        setForm({ confirmed_date: "", confirmed_time: "", admin_response: "" });
    }

    function closeModal() {
        setModal(null);
    }

    function submitAction() {
        setSubmitting(true);
        const urls = {
            confirm: `/admin/bookings/${modal.reference_number}/confirm`,
            reschedule: `/admin/bookings/${modal.reference_number}/reschedule`,
            cancel: `/admin/bookings/${modal.reference_number}/cancel`,
        };
        router.post(urls[action], form, {
            onSuccess: () => {
                closeModal();
                setSubmitting(false);
            },
            onError: () => setSubmitting(false),
        });
    }

    function deleteBooking(reference_number) {
        if (confirm("Delete this booking permanently?")) {
            router.post(`/admin/bookings/${reference_number}/delete`);
        }
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-800">
                    Consultation Bookings
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage all client consultation requests.
                </p>
            </div>

            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: "Total",
                        value: stats.total,
                        color: "text-gray-800",
                    },
                    {
                        label: "Pending",
                        value: stats.pending,
                        color: "text-yellow-700",
                    },
                    {
                        label: "Confirmed",
                        value: stats.confirmed,
                        color: "text-green-700",
                    },
                    {
                        label: "Cancelled",
                        value: stats.cancelled,
                        color: "text-red-600",
                    },
                ].map(({ label, value, color }) => (
                    <div
                        key={label}
                        className="bg-white rounded-xl p-5 border border-gray-100 text-center"
                    >
                        <p className={`text-3xl font-medium ${color}`}>
                            {value}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    "all",
                    "pending",
                    "confirmed",
                    "rescheduled",
                    "cancelled",
                ].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                            filter === tab
                                ? "bg-green-700 text-white"
                                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Bookings list */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-gray-400 text-sm">
                    No bookings found.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((booking) => {
                        const style = statusStyle[booking.status] ?? {
                            bg: "#f3f4f6",
                            text: "#6b7280",
                        };
                        return (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl border border-gray-100 px-6 py-4 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {/* Avatar */}
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                                        style={{
                                            background: "#e0f2fe",
                                            color: "#0369a1",
                                        }}
                                    >
                                        {getInitials(booking.name)}
                                    </div>

                                    {/* Name and Status */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-gray-800 text-sm">
                                                {booking.name}
                                            </p>
                                            <span
                                                className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                                                style={{
                                                    background: style.bg,
                                                    color: style.text,
                                                }}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                                            {booking.service_type} ·{" "}
                                            {booking.preferred_date} at{" "}
                                            {booking.preferred_time}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Manage Button */}
                                    <button
                                        onClick={() => openModal(booking)}
                                        className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs hover:bg-green-800 transition"
                                    >
                                        Manage
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() =>
                                            deleteBooking(
                                                booking.reference_number,
                                            )
                                        }
                                        className="px-3 py-1.5 border border-gray-200 text-gray-400 rounded-lg text-xs hover:bg-gray-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Split panel modal */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    {/* Modal Content */}
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden border border-gray-100">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <p className="font-medium text-gray-800">
                                    Booking request
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Ref: {modal.reference_number}
                                </p>
                            </div>
                            <span
                                className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                                style={{
                                    background:
                                        statusStyle[modal.status]?.bg ??
                                        "#f3f4f6",
                                    color:
                                        statusStyle[modal.status]?.text ??
                                        "#6b7280",
                                }}
                            >
                                {modal.status}
                            </span>
                        </div>

                        {/* Split body */}
                        <div className="grid grid-cols-2">
                            {/* Left — client info */}
                            <div className="px-5 py-4 border-r border-gray-100">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
                                    Client information
                                </p>

                                {/* Avatar + name */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                                        style={{
                                            background: "#e0f2fe",
                                            color: "#0369a1",
                                        }}
                                    >
                                        {getInitials(modal.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {modal.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {modal.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    {[
                                        { label: "Phone", value: modal.phone },
                                        {
                                            label: "Service",
                                            value: modal.service_type,
                                        },
                                        {
                                            label: "Preferred date",
                                            value: modal.preferred_date,
                                        },
                                        {
                                            label: "Preferred time",
                                            value: modal.preferred_time,
                                        },
                                        {
                                            label: "Type",
                                            value: modal.consultation_type,
                                        },
                                    ].map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex gap-3 text-xs py-1.5 border-b border-gray-50"
                                        >
                                            <span className="text-gray-400 flex-shrink-0 w-24">
                                                {label}
                                            </span>
                                            <span
                                                className="text-gray-700 font-medium"
                                                style={{
                                                    wordBreak: "break-word",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Message */}
                                {modal.message && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">
                                            Message
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {modal.message}
                                        </p>
                                    </div>
                                )}

                                {/* Previous admin response */}
                                {modal.admin_response && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">
                                            Previous note
                                        </p>
                                        <p className="text-xs text-green-700 leading-relaxed">
                                            {modal.admin_response}
                                        </p>
                                    </div>
                                )}

                                {/* Confirmed schedule */}
                                {modal.confirmed_date && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">
                                            Scheduled
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            {modal.confirmed_date} at{" "}
                                            {modal.confirmed_time}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right — admin action */}
                            <div className="px-5 py-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
                                    Admin action
                                </p>

                                {/* Action toggle */}
                                <div className="flex gap-1.5 mb-4">
                                    {[
                                        {
                                            key: "confirm",
                                            label: "Confirm",
                                            bg: "#dcfce7",
                                            color: "#166534",
                                        },
                                        {
                                            key: "reschedule",
                                            label: "Reschedule",
                                            bg: "#dbeafe",
                                            color: "#1e40af",
                                        },
                                        {
                                            key: "cancel",
                                            label: "Cancel",
                                            bg: "#fee2e2",
                                            color: "#991b1b",
                                        },
                                    ].map(({ key, label, bg, color }) => (
                                        <button
                                            key={key}
                                            onClick={() => setAction(key)}
                                            style={{
                                                flex: 1,
                                                padding: "6px 4px",
                                                fontSize: "11px",
                                                fontWeight: 500,
                                                borderRadius: "8px",
                                                border:
                                                    action === key
                                                        ? `1.5px solid ${color}`
                                                        : "1px solid #e5e7eb",
                                                background:
                                                    action === key
                                                        ? bg
                                                        : "transparent",
                                                color:
                                                    action === key
                                                        ? color
                                                        : "#9ca3af",
                                                cursor: "pointer",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Form fields */}
                                <div className="space-y-3">
                                    {(action === "confirm" ||
                                        action === "reschedule") && (
                                        <>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Confirmed date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={form.confirmed_date}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            confirmed_date:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Confirmed time
                                                </label>
                                                <select
                                                    value={form.confirmed_time}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            confirmed_time:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-green-500"
                                                >
                                                    <option value="">
                                                        -- Select time --
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
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            {action === "cancel"
                                                ? "Reason for cancellation"
                                                : "Note to client"}{" "}
                                            (optional)
                                        </label>
                                        <textarea
                                            value={form.admin_response}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    admin_response:
                                                        e.target.value,
                                                })
                                            }
                                            rows={action === "cancel" ? 5 : 3}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-green-500 resize-none"
                                            placeholder="Add a note..."
                                        />
                                    </div>

                                    <button
                                        onClick={submitAction}
                                        disabled={submitting}
                                        style={{
                                            width: "100%",
                                            padding: "9px",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: submitting
                                                ? "not-allowed"
                                                : "pointer",
                                            opacity: submitting ? 0.6 : 1,
                                            background:
                                                action === "confirm"
                                                    ? "#15803d"
                                                    : action === "reschedule"
                                                      ? "#1d4ed8"
                                                      : "#dc2626",
                                            color: "white",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {submitting
                                            ? "Saving..."
                                            : action === "confirm"
                                              ? "Confirm booking"
                                              : action === "reschedule"
                                                ? "Reschedule booking"
                                                : "Cancel booking"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="text-xs text-gray-400 border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
