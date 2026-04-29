// Admin Bookings Index — list, filter, search and manage bookings

import AdminLayout from "../../../Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
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
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, color, bg, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                borderRadius: 14,
                border: `1.5px solid ${active ? color : "#e5e7eb"}`,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                transform: active ? "translateY(-2px)" : "translateY(0)",
                boxShadow: active ? `0 6px 20px ${color}22` : "none",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: active ? color : "#e5e7eb",
                    borderRadius: "14px 0 0 14px",
                    transition: "background 0.25s",
                }}
            />
            <p
                style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: active ? color : "#374151",
                    paddingLeft: 8,
                }}
            >
                {value}
            </p>
            <p
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 2,
                    paddingLeft: 8,
                }}
            >
                {label}
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────── */
function Pagination({ data }) {
    if (data.last_page <= 1) return null;
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderTop: "1px solid #f3f4f6",
            }}
        >
            <p style={{ fontSize: 11, color: "#9ca3af" }}>
                Showing{" "}
                <span style={{ fontWeight: 600, color: "#374151" }}>
                    {data.from}–{data.to}
                </span>{" "}
                of{" "}
                <span style={{ fontWeight: 600, color: "#374151" }}>
                    {data.total}
                </span>{" "}
                records
            </p>
            <div style={{ display: "flex", gap: 6 }}>
                {data.links.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        style={{
                            padding: "5px 11px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            background: link.active
                                ? "linear-gradient(135deg,#064e3b,#065f46)"
                                : "#fff",
                            color: link.active ? "#fff" : "#374151",
                            border: `1px solid ${link.active ? "#064e3b" : "#e5e7eb"}`,
                            opacity: !link.url ? 0.35 : 1,
                            cursor: !link.url ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Index({ bookings, stats, filters }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "all");

    function applyFilters(s, st) {
        router.get(
            "/admin/bookings",
            { search: s, status: st },
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

    function deleteBooking(ref) {
        if (confirm("Delete this booking permanently?"))
            router.post(`/admin/bookings/${ref}/delete`);
    }

    return (
        <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .tbl-row { transition: background 0.15s ease; }
                .tbl-row:hover { background: #f9fafb; }
                .action-pill { transition: all 0.2s ease; }
                .action-pill:hover { filter: brightness(0.93); transform: translateY(-1px); }
                .search-box:focus-within { border-color: #4ade80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.1); }
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
                        Admin Panel
                    </p>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#111827",
                            marginBottom: 2,
                        }}
                    >
                        Consultation Bookings
                    </h1>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                        All client consultation requests — search, filter and
                        manage from here.
                    </p>
                </div>
            </div>

            {/* ── STAT CARDS (also act as filters) ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: 12,
                    marginBottom: 20,
                    animation:
                        "fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.06s both",
                }}
            >
                {[
                    {
                        label: "Pending",
                        value: stats.pending,
                        color: "#d97706",
                        key: "pending",
                    },
                    {
                        label: "Confirmed",
                        value: stats.confirmed,
                        color: "#15803d",
                        key: "confirmed",
                    },
                    {
                        label: "Rescheduled",
                        value: stats.rescheduled,
                        color: "#1d4ed8",
                        key: "rescheduled",
                    },
                    {
                        label: "Cancelled",
                        value: stats.cancelled,
                        color: "#dc2626",
                        key: "cancelled",
                    },
                ].map(({ label, value, color, key }) => (
                    <StatCard
                        key={key}
                        label={label}
                        value={value}
                        color={color}
                        active={status === key}
                        onClick={() =>
                            handleStatus(status === key ? "all" : key)
                        }
                    />
                ))}
            </div>

            {/* ── TOOLBAR ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                    animation:
                        "fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.1s both",
                }}
            >
                {/* Status tabs */}
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        background: "#fff",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 4,
                    }}
                >
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
                            style={{
                                padding: "6px 12px",
                                borderRadius: 7,
                                fontSize: 11,
                                fontWeight: 600,
                                background:
                                    status === s
                                        ? "linear-gradient(135deg,#064e3b,#065f46)"
                                        : "transparent",
                                color: status === s ? "#fff" : "#6b7280",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                textTransform: "capitalize",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div
                    className="search-box"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "7px 14px",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        width: 240,
                    }}
                >
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
                        style={{
                            outline: "none",
                            background: "transparent",
                            fontSize: 12,
                            color: "#374151",
                            flex: 1,
                            border: "none",
                        }}
                    />
                    {search && (
                        <button
                            onClick={() =>
                                handleSearch({ target: { value: "" } })
                            }
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                fontSize: 14,
                                padding: 0,
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* ── TABLE ── */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    animation:
                        "fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.14s both",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                    }}
                >
                    <colgroup>
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "12%" }} />
                    </colgroup>
                    <thead>
                        <tr
                            style={{
                                background: "#f9fafb",
                                borderBottom: "1px solid #e5e7eb",
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
                                    style={{
                                        padding: "11px 14px",
                                        textAlign: "left",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: "#9ca3af",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
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
                                    style={{
                                        padding: "60px 20px",
                                        textAlign: "center",
                                        color: "#9ca3af",
                                        fontSize: 13,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 36,
                                            marginBottom: 10,
                                        }}
                                    >
                                        📭
                                    </div>
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.data.map((booking, i) => {
                                const av = getAvatarColor(booking.name);
                                const s =
                                    statusStyle[booking.status] ??
                                    statusStyle.pending;
                                return (
                                    <tr
                                        key={booking.id}
                                        className="tbl-row"
                                        style={{
                                            borderBottom:
                                                i < bookings.data.length - 1
                                                    ? "1px solid #f3f4f6"
                                                    : "none",
                                        }}
                                    >
                                        {/* Ref */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 9,
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

                                        {/* Client */}
                                        <td style={{ padding: "12px 14px" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: "50%",
                                                        background: av.bg,
                                                        color: av.color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: 9,
                                                        fontWeight: 800,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {getInitials(booking.name)}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p
                                                        style={{
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            color: "#111827",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {booking.name}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: 10,
                                                            color: "#9ca3af",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {booking.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Service */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 11,
                                                color: "#374151",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {booking.service_type}
                                        </td>

                                        {/* Pref Date */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 11,
                                                color: "#374151",
                                            }}
                                        >
                                            {booking.preferred_date
                                                ? new Date(
                                                      booking.preferred_date,
                                                  ).toLocaleDateString("en-GB")
                                                : "—"}
                                        </td>

                                        {/* Time */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 11,
                                                color: "#374151",
                                            }}
                                        >
                                            {booking.preferred_time ?? "—"}
                                        </td>

                                        {/* Type */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 11,
                                                color: "#374151",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {booking.consultation_type}
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: "12px 14px" }}>
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: "3px 9px",
                                                    borderRadius: 99,
                                                    background: s.bg,
                                                    color: s.color,
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        {/* Submitted */}
                                        <td
                                            style={{
                                                padding: "12px 14px",
                                                fontSize: 10,
                                                color: "#9ca3af",
                                            }}
                                        >
                                            {new Date(
                                                booking.created_at,
                                            ).toLocaleDateString("en-MY", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: "12px 14px" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 5,
                                                }}
                                            >
                                                <a
                                                    href={`/admin/bookings/${booking.reference_number}`}
                                                    className="action-pill"
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        background:
                                                            "linear-gradient(135deg,#064e3b,#065f46)",
                                                        color: "#fff",
                                                        padding: "4px 10px",
                                                        borderRadius: 99,
                                                        border: "none",
                                                        cursor: "pointer",
                                                        textAlign: "center",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    Manage
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        deleteBooking(
                                                            booking.reference_number,
                                                        )
                                                    }
                                                    className="action-pill"
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        background: "#fef2f2",
                                                        color: "#dc2626",
                                                        padding: "4px 10px",
                                                        borderRadius: 99,
                                                        border: "1px solid #fecaca",
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
        </AdminLayout>
    );
}