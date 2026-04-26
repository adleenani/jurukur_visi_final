import AdminLayout from "../../../Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

const statusStyle = {
    pending: { bg: "#fef9c3", color: "#854d0e" },
    confirmed: { bg: "#d1fae5", color: "#065f46" },
    rescheduled: { bg: "#dbeafe", color: "#1e40af" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const avatarColors = [
    { bg: "#fef9c3", color: "#854d0e" },
    { bg: "#d1fae5", color: "#065f46" },
    { bg: "#dbeafe", color: "#1e40af" },
    { bg: "#fce7f3", color: "#9d174d" },
    { bg: "#ede9fe", color: "#6d28d9" },
];

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (
        parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
    ).toUpperCase();
}

function getAvatarColor(name) {
    return avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];
}

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
];

function Pagination({ data }) {
    if (data.last_page <= 1) return null;
    return (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
                Showing {data.from}–{data.to} of {data.total} records
            </p>
            <div className="flex gap-1.5">
                {data.links.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        style={{
                            background: link.active ? "#064e3b" : "white",
                            color: link.active ? "white" : "#374151",
                            border: "0.5px solid #e5e7eb",
                            opacity: !link.url ? 0.4 : 1,
                            cursor: !link.url ? "not-allowed" : "pointer",
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Index({ bookings, stats, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "all");
    const [modal, setModal] = useState(null);
    const [action, setAction] = useState("confirm");
    const [form, setForm] = useState({
        confirmed_date: "",
        confirmed_time: "",
        admin_response: "",
    });
    const [submitting, setSubmitting] = useState(false);

    function applyFilters(newSearch, newStatus) {
        router.get(
            "/admin/bookings",
            {
                search: newSearch,
                status: newStatus,
            },
            { preserveState: true, replace: true },
        );
    }

    function handleSearch(e) {
        setSearch(e.target.value);
        applyFilters(e.target.value, status);
    }

    function handleStatus(s) {
        setStatus(s);
        applyFilters(search, s);
    }

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
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Consultation Bookings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    All client consultation requests — search, filter and manage
                    from here.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Pending",
                        value: stats.pending,
                        color: "#d97706",
                        bg: "#fffbeb",
                    },
                    {
                        label: "Confirmed",
                        value: stats.confirmed,
                        color: "#15803d",
                        bg: "#f0fdf4",
                    },
                    {
                        label: "Rescheduled",
                        value: stats.rescheduled,
                        color: "#1d4ed8",
                        bg: "#dbeafe",
                    },
                    {
                        label: "Cancelled",
                        value: stats.cancelled,
                        color: "#dc2626",
                        bg: "#fef2f2",
                    },
                ].map(({ label, value, color, bg }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-4 border"
                        style={{ background: bg, borderColor: "transparent" }}
                    >
                        <p className="text-3xl font-bold" style={{ color }}>
                            {value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                    {[
                        "all",
                        "pending",
                        "confirmed",
                        "rescheduled",
                        "cancelled",
                    ].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatus(s)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                            style={{
                                background:
                                    status === s ? "#064e3b" : "transparent",
                                color: status === s ? "white" : "#6b7280",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <svg
                        width="13"
                        height="13"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search name, email, ref..."
                        className="outline-none bg-transparent text-gray-700"
                        style={{
                            fontSize: "12px",
                            fontFamily: "Raleway, sans-serif",
                            width: "180px",
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "23%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "7%" }} />
                    </colgroup>
                    <thead>
                        <tr
                            style={{
                                background: "#f9fafb",
                                borderBottom: "0.5px solid #e5e7eb",
                            }}
                        >
                            {[
                                "Ref No",
                                "Client",
                                "Service",
                                "Pref. Date",
                                "Time",
                                "Type",
                                "Status",
                                "Submitted",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left font-semibold text-gray-400"
                                    style={{
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-16 text-center text-gray-400 text-sm"
                                >
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.data.map((booking) => {
                                const av = getAvatarColor(booking.name);
                                const s =
                                    statusStyle[booking.status] ??
                                    statusStyle.pending;
                                return (
                                    <tr
                                        key={booking.id}
                                        style={{
                                            borderBottom: "0.5px solid #f3f4f6",
                                        }}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td
                                            className="px-4 py-3"
                                            style={{
                                                fontSize: "9px",
                                                fontFamily: "monospace",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            {booking.reference_number.slice(
                                                0,
                                                8,
                                            )}
                                            ...
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                                                    style={{
                                                        fontSize: "9px",
                                                        background: av.bg,
                                                        color: av.color,
                                                    }}
                                                >
                                                    {getInitials(booking.name)}
                                                </div>
                                                <div>
                                                    <p
                                                        className="font-semibold text-gray-800 truncate"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {booking.name}
                                                    </p>
                                                    <p
                                                        className="text-gray-400 truncate"
                                                        style={{
                                                            fontSize: "10px",
                                                        }}
                                                    >
                                                        {booking.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-600 truncate"
                                            style={{ fontSize: "11px" }}
                                        >
                                            {booking.service_type}
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-600"
                                            style={{ fontSize: "11px" }}
                                        >
                                            {booking.preferred_date}
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-600"
                                            style={{ fontSize: "11px" }}
                                        >
                                            {booking.preferred_time}
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-600 capitalize"
                                            style={{ fontSize: "11px" }}
                                        >
                                            {booking.consultation_type}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="font-bold capitalize"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "3px 8px",
                                                    borderRadius: "99px",
                                                    background: s.bg,
                                                    color: s.color,
                                                }}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-400"
                                            style={{ fontSize: "10px" }}
                                        >
                                            {new Date(
                                                booking.created_at,
                                            ).toLocaleDateString("en-MY", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() =>
                                                        openModal(booking)
                                                    }
                                                    className="font-bold transition"
                                                    style={{
                                                        fontSize: "10px",
                                                        background: "#064e3b",
                                                        color: "white",
                                                        padding: "4px 8px",
                                                        borderRadius: "99px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteBooking(
                                                            booking.reference_number,
                                                        )
                                                    }
                                                    className="font-bold transition"
                                                    style={{
                                                        fontSize: "10px",
                                                        background: "#fef2f2",
                                                        color: "#dc2626",
                                                        padding: "4px 8px",
                                                        borderRadius: "99px",
                                                        border: "0.5px solid #fecaca",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                <Pagination data={bookings} />
            </div>

            {/* Split panel modal — same as before */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <p className="font-bold text-gray-800">
                                    Booking request
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Ref: {modal.reference_number}
                                </p>
                            </div>
                            <span
                                className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                                style={{
                                    background:
                                        statusStyle[modal.status]?.bg ??
                                        "#f3f4f6",
                                    color:
                                        statusStyle[modal.status]?.color ??
                                        "#6b7280",
                                }}
                            >
                                {modal.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2">
                            {/* Left — client info */}
                            <div className="px-5 py-4 border-r border-gray-100">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                                    Client information
                                </p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={{
                                            background: getAvatarColor(
                                                modal.name,
                                            ).bg,
                                            color: getAvatarColor(modal.name)
                                                .color,
                                        }}
                                    >
                                        {getInitials(modal.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {modal.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {modal.email}
                                        </p>
                                    </div>
                                </div>
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
                                                }}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
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
                                {modal.confirmed_date && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">
                                            Scheduled
                                        </p>
                                        <p className="text-xs text-blue-700 font-bold">
                                            {modal.confirmed_date} at{" "}
                                            {modal.confirmed_time}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Right — admin action */}
                            <div className="px-5 py-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                                    Admin action
                                </p>
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
                                                fontWeight: 600,
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
                                            fontWeight: 600,
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
