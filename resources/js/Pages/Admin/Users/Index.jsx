import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (
        parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
    ).toUpperCase();
}

export default function Index({ users, stats, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "all");

    function applyFilters(newSearch, newStatus) {
        router.get(
            "/admin/users",
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

    function approve(id, name) {
        if (confirm(`Activate account for ${name}?`)) {
            router.post(`/admin/users/${id}/approve`);
        }
    }

    function reject(id, name) {
        if (confirm(`Deactivate account for ${name}?`)) {
            router.post(`/admin/users/${id}/reject`);
        }
    }

    function deleteUser(id, name) {
        if (
            confirm(
                `Permanently delete ${name}'s account? This cannot be undone.`,
            )
        ) {
            router.post(`/admin/users/${id}/delete`);
        }
    }

    const userData = users?.data ?? [];

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Staff Account Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All PIC staff accounts — search, filter and manage from
                        here.
                    </p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition"
                    style={{ background: "#15803d" }}
                >
                    + Create Staff Account
                </Link>
            </div>

            {/* Flash */}
            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
                    {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: "Total Staff",
                        value: stats?.total ?? 0,
                        color: "#1d4ed8",
                        bg: "#eff6ff",
                    },
                    {
                        label: "Active",
                        value: stats?.active ?? 0,
                        color: "#15803d",
                        bg: "#f0fdf4",
                    },
                    {
                        label: "Inactive",
                        value: stats?.inactive ?? 0,
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
                    {["all", "active", "inactive"].map((s) => (
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
                        placeholder="Search name, username, email..."
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
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "23%" }} />
                        <col style={{ width: "13%" }} />
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
                        {userData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-16 text-center text-gray-400 text-sm"
                                >
                                    No staff accounts found.
                                </td>
                            </tr>
                        ) : (
                            userData.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: "0.5px solid #f3f4f6",
                                    }}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {/* Name + Avatar */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                                                style={{
                                                    fontSize: "10px",
                                                    background: user.is_active
                                                        ? "#d1fae5"
                                                        : "#fee2e2",
                                                    color: user.is_active
                                                        ? "#065f46"
                                                        : "#991b1b",
                                                }}
                                            >
                                                {getInitials(user.full_name)}
                                            </div>
                                            <span
                                                className="font-semibold text-gray-800 truncate"
                                                style={{ fontSize: "12px" }}
                                            >
                                                {user.full_name ??
                                                    user.username}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Username */}
                                    <td
                                        className="px-4 py-3 text-gray-500"
                                        style={{ fontSize: "12px" }}
                                    >
                                        @{user.username}
                                    </td>

                                    {/* Email */}
                                    <td
                                        className="px-4 py-3 text-gray-500 truncate"
                                        style={{ fontSize: "12px" }}
                                    >
                                        {user.email}
                                    </td>

                                    {/* Created */}
                                    <td
                                        className="px-4 py-3 text-gray-400"
                                        style={{ fontSize: "11px" }}
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
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontSize: "10px",
                                                padding: "3px 8px",
                                                borderRadius: "99px",
                                                background: user.is_active
                                                    ? "#d1fae5"
                                                    : "#fee2e2",
                                                color: user.is_active
                                                    ? "#065f46"
                                                    : "#991b1b",
                                            }}
                                        >
                                            {user.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Password status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontSize: "10px",
                                                padding: "3px 8px",
                                                borderRadius: "99px",
                                                background:
                                                    user.must_change_password
                                                        ? "#fef9c3"
                                                        : "#d1fae5",
                                                color: user.must_change_password
                                                    ? "#854d0e"
                                                    : "#065f46",
                                            }}
                                        >
                                            {user.must_change_password
                                                ? "Temp"
                                                : "Set"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            {user.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        reject(
                                                            user.id,
                                                            user.full_name ??
                                                                user.username,
                                                        )
                                                    }
                                                    style={{
                                                        fontSize: "10px",
                                                        background: "#fef2f2",
                                                        color: "#dc2626",
                                                        padding: "3px 8px",
                                                        borderRadius: "99px",
                                                        border: "0.5px solid #fecaca",
                                                        cursor: "pointer",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        approve(
                                                            user.id,
                                                            user.full_name ??
                                                                user.username,
                                                        )
                                                    }
                                                    style={{
                                                        fontSize: "10px",
                                                        background: "#d1fae5",
                                                        color: "#065f46",
                                                        padding: "3px 8px",
                                                        borderRadius: "99px",
                                                        border: "0.5px solid #6ee7b7",
                                                        cursor: "pointer",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    deleteUser(
                                                        user.id,
                                                        user.full_name ??
                                                            user.username,
                                                    )
                                                }
                                                style={{
                                                    fontSize: "10px",
                                                    background: "#fef2f2",
                                                    color: "#dc2626",
                                                    padding: "3px 8px",
                                                    borderRadius: "99px",
                                                    border: "0.5px solid #fecaca",
                                                    cursor: "pointer",
                                                    fontWeight: 600,
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
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Showing {users.from}–{users.to} of {users.total}{" "}
                            records
                        </p>
                        <div className="flex gap-1.5">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    disabled={!link.url}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                    style={{
                                        background: link.active
                                            ? "#064e3b"
                                            : "white",
                                        color: link.active
                                            ? "white"
                                            : "#374151",
                                        border: "0.5px solid #e5e7eb",
                                        opacity: !link.url ? 0.4 : 1,
                                        cursor: !link.url
                                            ? "not-allowed"
                                            : "pointer",
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
