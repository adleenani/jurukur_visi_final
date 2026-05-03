// Admin Bookings Show — view and manage a single booking

import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link } from "@inertiajs/react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
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

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
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

/* ─────────────────────────────────────────────
   DETAIL ROW
───────────────────────────────────────────── */
function DetailRow({ label, value }) {
    if (!value) return null;
    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                padding: "9px 0",
                borderBottom: "1px solid #f3f4f6",
            }}
        >
            <span
                style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    flexShrink: 0,
                    width: 120,
                    fontWeight: 600,
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: 12,
                    color: "#374151",
                    fontWeight: 500,
                    flex: 1,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Show({ booking }) {
    const [action, setAction] = useState("confirm");
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        confirmed_date: "",
        confirmed_time: "",
        admin_response: "",
    });

    const s = statusStyle[booking.status] ?? statusStyle.pending;
    const av = getAvatarColor(booking.name);

    function submitAction() {
        setSubmitting(true);
        const urls = {
            confirm: `/admin/bookings/${booking.reference_number}/confirm`,
            reschedule: `/admin/bookings/${booking.reference_number}/reschedule`,
            cancel: `/admin/bookings/${booking.reference_number}/cancel`,
        };
        router.post(urls[action], form, {
            onSuccess: () => setSubmitting(false),
            onError: () => setSubmitting(false),
        });
    }

    const actionConfig = {
        confirm: {
            label: "Confirm Booking",
            bg: "#15803d",
            ring: "#15803d",
            tint: "#dcfce7",
            tintText: "#166534",
        },
        reschedule: {
            label: "Reschedule Booking",
            bg: "#1d4ed8",
            ring: "#1d4ed8",
            tint: "#dbeafe",
            tintText: "#1e40af",
        },
        cancel: {
            label: "Cancel Booking",
            bg: "#dc2626",
            ring: "#dc2626",
            tint: "#fee2e2",
            tintText: "#991b1b",
        },
    };

    return (
        <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .act-btn { transition: all 0.2s ease; }
                .act-btn:hover:not(:disabled) { filter: brightness(0.93); }
            `}</style>

            {/* ── HEADER ── */}
            <div
                style={{
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1) both",
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                        }}
                    >
                        PIC Panel · Bookings
                    </p>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#111827",
                            marginBottom: 2,
                        }}
                    >
                        Manage Booking
                    </h1>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#9ca3af",
                            fontFamily: "monospace",
                        }}
                    >
                        Ref: {booking.reference_number}
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "5px 14px",
                            borderRadius: 99,
                            background: s.bg,
                            color: s.color,
                            textTransform: "capitalize",
                        }}
                    >
                        {booking.status}
                    </span>
                    <Link
                        href="/admin/bookings"
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#6b7280",
                            background: "#fff",
                            border: "1.5px solid #e5e7eb",
                            padding: "9px 18px",
                            borderRadius: 10,
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#d1d5db";
                            e.currentTarget.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#fff";
                        }}
                    >
                        ← Back to Bookings
                    </Link>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    animation:
                        "fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.08s both",
                }}
            >
                {/* ── LEFT: CLIENT INFO ── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    {/* Client card */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "14px 20px",
                                borderBottom: "1px solid #f3f4f6",
                                background: "#f9fafb",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#9ca3af",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Client Information
                            </p>
                        </div>
                        <div style={{ padding: "20px" }}>
                            {/* Avatar + name */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: av.bg,
                                        color: av.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        flexShrink: 0,
                                    }}
                                >
                                    {getInitials(booking.name)}
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: "#111827",
                                        }}
                                    >
                                        {booking.name}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: "#9ca3af",
                                        }}
                                    >
                                        {booking.email}
                                    </p>
                                </div>
                            </div>
                            <DetailRow label="Phone" value={booking.phone} />
                            <DetailRow
                                label="Company"
                                value={booking.company_name ?? "—"}
                            />
                            <DetailRow
                                label="Service"
                                value={booking.service_type}
                            />
                            <DetailRow
                                label="Preferred Date"
                                value={
                                    booking.preferred_date
                                        ? new Date(
                                              booking.preferred_date,
                                          ).toLocaleDateString("en-GB")
                                        : null
                                }
                            />
                            <DetailRow
                                label="Consultation Type"
                                value={booking.consultation_type}
                            />
                            <DetailRow
                                label="Submitted"
                                value={new Date(
                                    booking.created_at,
                                ).toLocaleDateString("en-MY", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            />
                        </div>
                    </div>

                    {/* Message card */}
                    {booking.message && (
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 16,
                                border: "1px solid #e5e7eb",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    padding: "14px 20px",
                                    borderBottom: "1px solid #f3f4f6",
                                    background: "#f9fafb",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "#9ca3af",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    Client Message
                                </p>
                            </div>
                            <div style={{ padding: "18px 20px" }}>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "#374151",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {booking.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Confirmed appointment card */}
                    {booking.confirmed_date && (
                        <div
                            style={{
                                background: "#f0fdf4",
                                borderRadius: 16,
                                border: "1px solid #bbf7d0",
                                padding: "18px 20px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#15803d",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 6,
                                }}
                            >
                                ✓ Confirmed Appointment
                            </p>
                            <p
                                style={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: "#064e3b",
                                }}
                            >
                                {new Date(
                                    booking.confirmed_date,
                                ).toLocaleDateString("en-MY", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}{" "}
                                at {booking.confirmed_time}
                            </p>
                        </div>
                    )}

                    {/* Admin note card */}
                    {booking.admin_response && (
                        <div
                            style={{
                                background: "#eff6ff",
                                borderRadius: 16,
                                border: "1px solid #bfdbfe",
                                padding: "18px 20px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#1d4ed8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 6,
                                }}
                            >
                                Note from Admin
                            </p>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: "#1e40af",
                                    lineHeight: 1.6,
                                }}
                            >
                                {booking.admin_response}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: ADMIN ACTION ── */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        alignSelf: "start",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid #f3f4f6",
                            background: "#f9fafb",
                        }}
                    >
                        <p
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#9ca3af",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}
                        >
                            Admin Action
                        </p>
                    </div>
                    <div
                        style={{
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {/* Action selector */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 8,
                            }}
                        >
                            {[
                                {
                                    key: "confirm",
                                    label: "Confirm",
                                    tint: "#dcfce7",
                                    color: "#166534",
                                },
                                {
                                    key: "reschedule",
                                    label: "Reschedule",
                                    tint: "#dbeafe",
                                    color: "#1e40af",
                                },
                                {
                                    key: "cancel",
                                    label: "Cancel",
                                    tint: "#fee2e2",
                                    color: "#991b1b",
                                },
                            ].map(({ key, label, tint, color }) => (
                                <button
                                    key={key}
                                    onClick={() => setAction(key)}
                                    style={{
                                        padding: "8px 6px",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        borderRadius: 9,
                                        border:
                                            action === key
                                                ? `1.5px solid ${color}`
                                                : "1.5px solid #e5e7eb",
                                        background:
                                            action === key ? tint : "#fff",
                                        color:
                                            action === key ? color : "#9ca3af",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Date + Time (confirm / reschedule) */}
                        {(action === "confirm" || action === "reschedule") && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 12,
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#374151",
                                            marginBottom: 5,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.03em",
                                        }}
                                    >
                                        Confirmed Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.confirmed_date}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                confirmed_date: e.target.value,
                                            })
                                        }
                                        style={{
                                            width: "100%",
                                            border: "1.5px solid #e5e7eb",
                                            borderRadius: 9,
                                            padding: "9px 12px",
                                            fontSize: 12,
                                            boxSizing: "border-box",
                                            outline: "none",
                                            transition:
                                                "border-color 0.2s, box-shadow 0.2s",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#4ade80";
                                            e.target.style.boxShadow =
                                                "0 0 0 3px rgba(74,222,128,0.12)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                "#e5e7eb";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#374151",
                                            marginBottom: 5,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.03em",
                                        }}
                                    >
                                        Confirmed Time
                                    </label>
                                    <select
                                        value={form.confirmed_time}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                confirmed_time: e.target.value,
                                            })
                                        }
                                        style={{
                                            width: "100%",
                                            border: "1.5px solid #e5e7eb",
                                            borderRadius: 9,
                                            padding: "9px 12px",
                                            fontSize: 12,
                                            boxSizing: "border-box",
                                            outline: "none",
                                            background: "#fff",
                                            cursor: "pointer",
                                            transition:
                                                "border-color 0.2s, box-shadow 0.2s",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#4ade80";
                                            e.target.style.boxShadow =
                                                "0 0 0 3px rgba(74,222,128,0.12)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                "#e5e7eb";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    >
                                        <option value="">
                                            -- Select time --
                                        </option>
                                        {timeSlots.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Note / reason */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#374151",
                                    marginBottom: 5,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                {action === "cancel"
                                    ? "Reason for Cancellation"
                                    : "Note to Client"}{" "}
                                <span
                                    style={{
                                        color: "#9ca3af",
                                        fontWeight: 400,
                                        textTransform: "none",
                                    }}
                                >
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                value={form.admin_response}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        admin_response: e.target.value,
                                    })
                                }
                                rows={action === "cancel" ? 5 : 3}
                                placeholder="Add a note..."
                                style={{
                                    width: "100%",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 9,
                                    padding: "9px 12px",
                                    fontSize: 12,
                                    boxSizing: "border-box",
                                    outline: "none",
                                    resize: "none",
                                    transition:
                                        "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#4ade80";
                                    e.target.style.boxShadow =
                                        "0 0 0 3px rgba(74,222,128,0.12)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#e5e7eb";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={submitAction}
                            disabled={submitting}
                            className="act-btn"
                            style={{
                                width: "100%",
                                padding: "11px",
                                fontSize: 13,
                                fontWeight: 700,
                                borderRadius: 9,
                                border: "none",
                                cursor: submitting ? "not-allowed" : "pointer",
                                opacity: submitting ? 0.6 : 1,
                                background:
                                    action === "confirm"
                                        ? "linear-gradient(135deg,#15803d,#166534)"
                                        : action === "reschedule"
                                          ? "linear-gradient(135deg,#1d4ed8,#1e40af)"
                                          : "linear-gradient(135deg,#dc2626,#991b1b)",
                                color: "#fff",
                                transition: "all 0.2s",
                            }}
                        >
                            {submitting
                                ? "Saving..."
                                : actionConfig[action].label}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
