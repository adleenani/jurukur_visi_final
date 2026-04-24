import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (
        parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
    ).toUpperCase();
}

export default function Index({ users, stats }) {
    const { flash } = usePage().props;

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

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Staff Account Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage all PIC staff accounts.
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
                        value: stats.total,
                        color: "#1d4ed8",
                        bg: "#eff6ff",
                    },
                    {
                        label: "Active",
                        value: stats.active,
                        color: "#15803d",
                        bg: "#f0fdf4",
                    },
                    {
                        label: "Inactive",
                        value: stats.inactive,
                        color: "#dc2626",
                        bg: "#fef2f2",
                    },
                ].map(({ label, value, color, bg }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-5 border"
                        style={{ background: bg, borderColor: "transparent" }}
                    >
                        <p className="text-sm font-medium text-gray-500">
                            {label}
                        </p>
                        <p
                            className="text-4xl font-bold mt-1"
                            style={{ color }}
                        >
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "10%" }} />
                    </colgroup>
                    <thead>
                        <tr
                            style={{
                                background: "#f9fafb",
                                borderBottom: "0.5px solid #e5e7eb",
                            }}
                        >
                            {[
                                "Staff",
                                "Username",
                                "Email",
                                "Created",
                                "Status",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-5 py-3 text-left font-semibold text-gray-500"
                                    style={{ fontSize: "13px" }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-16 text-center text-gray-400 text-sm"
                                >
                                    No staff accounts yet.{" "}
                                    <Link
                                        href="/admin/users/create"
                                        className="text-green-700 hover:underline"
                                    >
                                        Create one!
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: "0.5px solid #f3f4f6",
                                    }}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {/* Name */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                                                style={{
                                                    fontSize: "12px",
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
                                                className="font-semibold text-gray-800"
                                                style={{ fontSize: "13px" }}
                                            >
                                                {user.full_name ??
                                                    user.username}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Username */}
                                    <td
                                        className="px-5 py-4 text-gray-500"
                                        style={{ fontSize: "13px" }}
                                    >
                                        @{user.username}
                                    </td>

                                    {/* Email */}
                                    <td
                                        className="px-5 py-4 text-gray-500"
                                        style={{ fontSize: "13px" }}
                                    >
                                        {user.email}
                                    </td>

                                    {/* Created */}
                                    <td
                                        className="px-5 py-4 text-gray-500"
                                        style={{ fontSize: "13px" }}
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
                                    <td className="px-5 py-4">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontSize: "11px",
                                                padding: "4px 10px",
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

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            {user.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        reject(
                                                            user.id,
                                                            user.full_name,
                                                        )
                                                    }
                                                    className="font-semibold transition"
                                                    style={{
                                                        fontSize: "12px",
                                                        background: "#fef2f2",
                                                        color: "#dc2626",
                                                        padding: "4px 10px",
                                                        borderRadius: "99px",
                                                        border: "0.5px solid #fecaca",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        approve(
                                                            user.id,
                                                            user.full_name,
                                                        )
                                                    }
                                                    className="font-semibold transition"
                                                    style={{
                                                        fontSize: "12px",
                                                        background: "#d1fae5",
                                                        color: "#065f46",
                                                        padding: "4px 10px",
                                                        borderRadius: "99px",
                                                        border: "0.5px solid #6ee7b7",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    deleteUser(
                                                        user.id,
                                                        user.full_name,
                                                    )
                                                }
                                                className="font-semibold transition"
                                                style={{
                                                    fontSize: "12px",
                                                    background: "#fef2f2",
                                                    color: "#dc2626",
                                                    padding: "4px 10px",
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
