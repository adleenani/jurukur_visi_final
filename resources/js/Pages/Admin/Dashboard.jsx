import AdminLayout from "../../Layout/AdminLayout";
import { Link, usePage } from "@inertiajs/react";

export default function Dashboard({
    stats = { total: 0, recent: [], pending_bookings: 0 },
}) {
    const { flash } = usePage().props;

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-800">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Welcome back to Jurukur Visi staff portal.
                    </p>
                </div>
                <Link
                    href="/admin/projects/create"
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition"
                >
                    + Add Project
                </Link>
            </div>

            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Total Projects</p>
                    <p className="text-4xl font-medium text-green-800 mt-1">
                        {stats.total}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Pending Bookings</p>
                    <p className="text-4xl font-medium text-yellow-600 mt-1">
                        {stats.pending_bookings}
                    </p>
                </div>
            </div>

            {/* Recent projects */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-medium text-gray-700">
                        Recently Added Projects
                    </h2>
                    <Link
                        href="/admin/projects"
                        className="text-sm text-green-700 hover:underline"
                    >
                        View all
                    </Link>
                </div>
                {stats.recent.length === 0 ? (
                    <div className="px-6 py-10 text-center text-gray-400 text-sm">
                        No projects yet.{" "}
                        <Link
                            href="/admin/projects/create"
                            className="text-green-700 hover:underline"
                        >
                            Add your first project.
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {stats.recent.map((project) => (
                            <div
                                key={project.id}
                                className="px-6 py-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {project.project_name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {project.project_location} ·{" "}
                                        {project.project_services}
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/projects/${project.project_id}/edit`}
                                    className="text-xs text-green-700 hover:underline"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
