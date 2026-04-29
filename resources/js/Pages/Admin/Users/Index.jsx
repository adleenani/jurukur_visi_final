// Admin Staff Account Management — consistent UI

import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (
        parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
    ).toUpperCase();
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, color, delay }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                padding: "12px 16px",
                position: "relative",
                overflow: "hidden",
                opacity: 0,
                animation: `fadeUp 0.5s cubic-bezier(.22,1,.36,1) ${delay}ms both`,
                transition:
                    "box-shadow 0.25s, border-color 0.25s, transform 0.25s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`;
                e.currentTarget.style.borderColor = color + "55";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: color,
                    borderRadius: "14px 0 0 14px",
                }}
            />
            <p style={{ fontSize: 30, fontWeight: 800, color, paddingLeft: 8 }}>
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
   MAIN
───────────────────────────────────────────── */
export default function Index({ users, stats, filters }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "all");

    function applyFilters(s, st) {
        router.get(
            "/admin/users",
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

    function approve(id, name) {
        if (confirm(`Activate account for ${name}?`))
            router.post(`/admin/users/${id}/approve`);
    }
    function reject(id, name) {
        if (confirm(`Deactivate account for ${name}?`))
            router.post(`/admin/users/${id}/reject`);
    }
    function deleteUser(id, name) {
        if (
            confirm(
                `Permanently delete ${name}'s account? This cannot be undone.`,
            )
        )
            router.post(`/admin/users/${id}/delete`);
    }

    const userData = users?.data ?? [];

    return (
        <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .tbl-row { transition: background 0.15s ease; }
                .tbl-row:hover { background: #f9fafb; }
                .action-pill { transition: all 0.2s ease; }
                .action-pill:hover { filter: brightness(0.93); transform: translateY(-1px); }
                .search-box:focus-within { border-color: #4ade80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.1); }
                .pg-btn:hover:not(:disabled) { border-color: #15803d !important; color: #15803d !important; }
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
                        Staff Accounts
                    </h1>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                        All PIC staff accounts — search, filter and manage from
                        here.
                    </p>
                </div>
                <Link
                    href="/admin/users/create"
                    style={{
                        background: "linear-gradient(135deg,#064e3b,#065f46)",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(6,78,59,0.2)",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-1px)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                    }
                >
                    + Create Staff Account
                </Link>
            </div>

            {/* ── STAT CARDS ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <StatCard
                    label="Total Staff"
                    value={stats?.total ?? 0}
                    color="#2563eb"
                    delay={0}
                />
                <StatCard
                    label="Active"
                    value={stats?.active ?? 0}
                    color="#15803d"
                    delay={80}
                />
                <StatCard
                    label="Inactive"
                    value={stats?.inactive ?? 0}
                    color="#dc2626"
                    delay={160}
                />
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
                    {["all", "active", "inactive"].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatus(s)}
                            style={{
                                padding: "6px 14px",
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
                        width: 260,
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
                        placeholder="Search name, username, email..."
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
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "12%" }} />
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
                                "Name",
                                "Username",
                                "Email",
                                "Created",
                                "Status",
                                "Password",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: "11px 16px",
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
                        {userData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
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
                                        👤
                                    </div>
                                    No staff accounts found.
                                </td>
                            </tr>
                        ) : (
                            userData.map((user, i) => (
                                <tr
                                    key={user.id}
                                    className="tbl-row"
                                    style={{
                                        borderBottom:
                                            i < userData.length - 1
                                                ? "1px solid #f3f4f6"
                                                : "none",
                                    }}
                                >
                                    {/* Name + Avatar */}
                                    <td style={{ padding: "12px 16px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 9,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: "50%",
                                                    background: user.is_active
                                                        ? "#dcfce7"
                                                        : "#fee2e2",
                                                    color: user.is_active
                                                        ? "#15803d"
                                                        : "#991b1b",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 10,
                                                    fontWeight: 800,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {getInitials(user.full_name)}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {user.full_name ??
                                                    user.username}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Username */}
                                    <td
                                        style={{
                                            padding: "12px 16px",
                                            fontSize: 12,
                                            color: "#6b7280",
                                        }}
                                    >
                                        @{user.username}
                                    </td>

                                    {/* Email */}
                                    <td
                                        style={{
                                            padding: "12px 16px",
                                            fontSize: 12,
                                            color: "#6b7280",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {user.email}
                                    </td>

                                    {/* Created */}
                                    <td
                                        style={{
                                            padding: "12px 16px",
                                            fontSize: 11,
                                            color: "#9ca3af",
                                        }}
                                    >
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString("en-MY", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: "12px 16px" }}>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: "3px 9px",
                                                borderRadius: 99,
                                                background: user.is_active
                                                    ? "#dcfce7"
                                                    : "#fee2e2",
                                                color: user.is_active
                                                    ? "#15803d"
                                                    : "#991b1b",
                                            }}
                                        >
                                            {user.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Password */}
                                    <td style={{ padding: "12px 16px" }}>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: "3px 9px",
                                                borderRadius: 99,
                                                background:
                                                    user.must_change_password
                                                        ? "#fef9c3"
                                                        : "#dcfce7",
                                                color: user.must_change_password
                                                    ? "#854d0e"
                                                    : "#15803d",
                                            }}
                                        >
                                            {user.must_change_password
                                                ? "Temp"
                                                : "Set"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "12px 16px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 5,
                                            }}
                                        >
                                            {user.is_active ? (
                                                <button
                                                    className="action-pill"
                                                    onClick={() =>
                                                        reject(
                                                            user.id,
                                                            user.full_name ??
                                                                user.username,
                                                        )
                                                    }
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
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-pill"
                                                    onClick={() =>
                                                        approve(
                                                            user.id,
                                                            user.full_name ??
                                                                user.username,
                                                        )
                                                    }
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        background: "#dcfce7",
                                                        color: "#15803d",
                                                        padding: "4px 10px",
                                                        borderRadius: 99,
                                                        border: "1px solid #6ee7b7",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            <button
                                                className="action-pill"
                                                onClick={() =>
                                                    deleteUser(
                                                        user.id,
                                                        user.full_name ??
                                                            user.username,
                                                    )
                                                }
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
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {users?.last_page > 1 && (
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
                                {users.from}–{users.to}
                            </span>{" "}
                            of{" "}
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                                {users.total}
                            </span>{" "}
                            records
                        </p>
                        <div style={{ display: "flex", gap: 6 }}>
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    className="pg-btn"
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
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
                                        cursor: !link.url
                                            ? "not-allowed"
                                            : "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
