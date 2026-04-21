import AdminLayout from "../../../Layout/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ projects }) {
    const { flash } = usePage().props;

    function deleteProject(project_id) {
    if (confirm('Are you sure you want to delete this project?')) {
        router.delete(`/admin/projects/${project_id}`, {
            preserveScroll: true,
        });
    }
}

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-800">
                        Projects
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        All completed surveying projects.
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

            {projects.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        No projects yet.
                    </p>
                    <Link
                        href="/admin/projects/create"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition"
                    >
                        Add First Project
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {[
                                    "Project ID",
                                    "Name",
                                    "Location",
                                    "Duration",
                                    "Service",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-5 py-4 font-medium text-green-800">
                                        {project.project_id}
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">
                                        {project.project_name}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        {project.project_location}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        {project.project_duration}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                                        {project.project_services}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/admin/projects/${project.project_id}/edit`}
                                                className="text-green-700 hover:underline text-xs"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deleteProject(
                                                        project.project_id,
                                                    )
                                                }
                                                className="text-red-500 hover:underline text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
