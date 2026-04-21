import AdminLayout from "../../../Layout/AdminLayout";
import { useForm } from "@inertiajs/react";

const services = [
    "Consultant and Survey Services in Cadastral",
    "Strata Title",
    "Topographic Hydrographic",
    "Engineering and Mapping",
    "Mining",
    "Aerial",
    "M.Tech",
    "GPS",
    "Land & Housing Development",
    "Underground Utilities Detection and Mapping",
];
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        project_id: "",
        project_name: "",
        project_start: "",
        project_end: "",
        project_location: "",
        project_services: "",
        project_description: "",
    });

    // Auto calculate duration for display
    function getDuration() {
        if (!data.project_start || !data.project_end) return "";
        const start = new Date(data.project_start);
        const end = new Date(data.project_end);
        if (end < start) return "End date must be after start date";
        const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const years = Math.floor(diff / 365);
        const months = Math.floor((diff % 365) / 30);
        const days = diff % 30;
        let result = "";
        if (years > 0) result += `${years} Year(s), `;
        if (months > 0) result += `${months} Month(s), `;
        result += `${days} Day(s)`;
        return result;
    }

    function submit(e) {
        e.preventDefault();
        post("/admin/projects");
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-800">
                    Add New Project
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Register a completed surveying project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-2xl">
                <form onSubmit={submit} className="space-y-6">
                    {/* Project ID + Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Project ID
                            </label>
                            <input
                                type="text"
                                value={data.project_id}
                                onChange={(e) =>
                                    setData("project_id", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                placeholder="PRJ-001"
                                required
                            />
                            {errors.project_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.project_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={data.project_name}
                                onChange={(e) =>
                                    setData("project_name", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                placeholder="Project name"
                                required
                            />
                            {errors.project_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.project_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={data.project_start}
                                onChange={(e) =>
                                    setData("project_start", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                required
                            />
                            {errors.project_start && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.project_start}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={data.project_end}
                                onChange={(e) =>
                                    setData("project_end", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                required
                            />
                            {errors.project_end && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.project_end}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Auto duration display */}
                    {getDuration() && (
                        <div className="bg-green-50 px-4 py-2.5 rounded-lg text-sm text-green-700">
                            Duration: {getDuration()}
                        </div>
                    )}

                    {/* Location */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Project Location
                        </label>
                        <input
                            type="text"
                            value={data.project_location}
                            onChange={(e) =>
                                setData("project_location", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            placeholder="e.g. Kuala Lumpur"
                            required
                        />
                        {errors.project_location && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.project_location}
                            </p>
                        )}
                    </div>

                    {/* Services */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Service Type
                        </label>
                        <select
                            value={data.project_services}
                            onChange={(e) =>
                                setData("project_services", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        >
                            <option value="">-- Select a service --</option>
                            {services.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        {errors.project_services && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.project_services}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            value={data.project_description}
                            onChange={(e) =>
                                setData("project_description", e.target.value)
                            }
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                            placeholder="Brief description of the project..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Project"}
                        </button>
                        <div>
                            <a
                                href="/admin/projects"
                                className="px-6 py-2.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
