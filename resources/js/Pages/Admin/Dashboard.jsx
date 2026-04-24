import ToastContainer from "../../Components/ToastContainer";
import AdminLayout from "../../Layouts/AdminLayout";
import { Link, usePage } from "@inertiajs/react";

export default function Dashboard({
    stats = {
        total: 0,
        recent: [],
        pending_bookings: 0,
        pending_booking_list: [],
    },
}) {
    const { flash, auth } = usePage().props;

    function getInitials(name) {
        const parts = name.trim().split(" ");
        return (
            parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
        ).toUpperCase();
    }

    const statCards = [
        {
            label: "Total Projects",
            value: stats.total,
            bg: "#15803d",
            icon: "📁",
        },
        {
            label: "Pending Bookings",
            value: stats.pending_bookings,
            bg: "#d97706",
            icon: "📅",
        },
        {
            label: "Total Bookings",
            value: stats.total_bookings ?? 0,
            bg: "#2563eb",
            icon: "📊",
        },
        {
            label: "Pending Staff",
            value: stats.pending_users ?? 0,
            bg: "#7c3aed",
            icon: "👤",
        },
    ];

    return (
        <AdminLayout>
            <ToastContainer />
            <div className="mb-8 flex items-center justify-between">
                {/* Left Side: Header Text */}
                <div>
                    <h1 className="text-2xl font-medium text-gray-800">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Welcome back to Jurukur Visi staff portal,{" "}
                        {auth?.user ?? "Admin"}.
                    </p>
                </div>

                {/* Right Side: Buttons Grouped Together */}
                <div className="flex gap-3">
                    <Link
                        href="/admin/projects/create"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                        + Add Project
                    </Link>

                    <Link
                        href="/admin/bookings"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                        Manage Bookings
                    </Link>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {statCards.map(({ label, value, bg, icon }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-5 text-white relative overflow-hidden"
                        style={{ background: bg }}
                    >
                        <p className="text-sm font-medium opacity-85">
                            {label}
                        </p>
                        <p className="text-4xl font-bold mt-1">{value}</p>
                        <div
                            style={{
                                position: "absolute",
                                right: "-8px",
                                bottom: "-8px",
                                fontSize: "52px",
                                opacity: 0.15,
                                lineHeight: 1,
                            }}
                        >
                            {icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent projects */}
            {/* Two column body */}
            <div className="grid grid-cols-2 gap-4">
                {/* Recent Projects */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div
                        className="px-5 py-3.5 flex items-center justify-between"
                        style={{ background: "#15803d" }}
                    >
                        <p className="text-white font-semibold text-sm">
                            🕐 Completed Projects
                        </p>
                        <Link
                            href="/admin/projects"
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                            }}
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recent.length === 0 ? (
                            <div className="px-5 py-10 text-center text-gray-400 text-sm">
                                No projects yet.{" "}
                                <Link
                                    href="/admin/projects/create"
                                    className="text-green-700 hover:underline"
                                >
                                    Add one!
                                </Link>
                            </div>
                        ) : (
                            stats.recent.map((project) => {
                                const initials = getInitials(
                                    project.project_name,
                                );
                                return (
                                    <div
                                        key={project.id}
                                        className="px-5 py-3.5 flex items-center gap-3"
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={{
                                                background: "#d1fae5",
                                                color: "#065f46",
                                            }}
                                        >
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {project.project_name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {project.project_location} ·{" "}
                                                {project.project_services}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Pending Bookings */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div
                        className="px-5 py-3.5 flex items-center justify-between"
                        style={{ background: "#d97706" }}
                    >
                        <p className="text-white font-semibold text-sm">
                            📅 Pending Bookings
                        </p>
                        <Link
                            href="/admin/bookings"
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                            }}
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {(stats.pending_booking_list ?? []).length === 0 ? (
                            <div className="px-5 py-10 text-center text-gray-400 text-sm">
                                No pending bookings. 🎉
                            </div>
                        ) : (
                            stats.pending_booking_list.map((booking) => {
                                const initials = getInitials(booking.name);
                                return (
                                    <div
                                        key={booking.id}
                                        className="px-5 py-3.5 flex items-center gap-3"
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={{
                                                background: "#fef9c3",
                                                color: "#854d0e",
                                            }}
                                        >
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {booking.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {booking.service_type} ·{" "}
                                                {booking.preferred_date}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                                            style={{
                                                background: "#fef9c3",
                                                color: "#854d0e",
                                            }}
                                        >
                                            Pending
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
