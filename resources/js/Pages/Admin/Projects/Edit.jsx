import AdminLayout from '../../../Layout/AdminLayout';
import { useForm } from '@inertiajs/react';

const services = [
    'Consultant and Survey Services in Cadastral',
    'Strata Title',
    'Topographic Hydrographic',
    'Engineering and Mapping',
    'Mining',
    'Aerial',
    'M.Tech',
    'GPS',
    'Land & Housing Development',
    'Underground Utilities Detection and Mapping',
];

export default function Edit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        project_name:        project.project_name ?? '',
        project_start:       project.project_start ?? '',
        project_end:         project.project_end ?? '',
        project_location:    project.project_location ?? '',
        project_services:    project.project_services ?? '',
        project_description: project.project_description ?? '',
    });

    function getDuration() {
        if (!data.project_start || !data.project_end) return '';
        const start = new Date(data.project_start);
        const end = new Date(data.project_end);
        if (end < start) return 'End date must be after start date';
        const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const years = Math.floor(diff / 365);
        const months = Math.floor((diff % 365) / 30);
        const days = diff % 30;
        let result = '';
        if (years > 0) result += `${years} Year(s), `;
        if (months > 0) result += `${months} Month(s), `;
        result += `${days} Day(s)`;
        return result;
    }

    function submit(e) {
        e.preventDefault();
        put(`/admin/projects/${project.project_id}`);
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-800">Edit Project</h1>

                <p className="text-gray-500 text-sm mt-1">
                    Updating: <span className="text-green-700 font-medium">{project.project_name}</span>
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-2xl">
                <form onSubmit={submit} className="space-y-6">

                    {/* Project ID — readonly */}

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Project ID</label>

                        <input
                            type="text"
                            value={project.project_id}
                            disabled
                            className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                        />

                        <p className="text-xs text-gray-400 mt-1">Project ID cannot be changed.</p>
                    </div>

                    {/* Name */}

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Project Name</label>

                        <input
                            type="text"
                            value={data.project_name}
                            onChange={e => setData('project_name', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        />

                        {errors.project_name && <p className="text-red-500 text-xs mt-1">{errors.project_name}</p>}
                    </div>

                    {/* Dates */}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Start Date</label>

                            <input
                                type="date"
                                value={data.project_start}
                                onChange={e => setData('project_start', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">End Date</label>

                            <input
                                type="date"
                                value={data.project_end}
                                onChange={e => setData('project_end', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                    </div>

                    {getDuration() && (
                        <div className="bg-green-50 px-4 py-2.5 rounded-lg text-sm text-green-700">
                            Duration: {getDuration()}
                        </div>
                    )}

                    {/* Location */}

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Project Location</label>

                        <input
                            type="text"
                            value={data.project_location}
                            onChange={e => setData('project_location', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Services */}

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Service Type</label>

                        <select
                            value={data.project_services}
                            onChange={e => setData('project_services', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        >
                            <option value="">-- Select a service --</option>

                            {services.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Description (optional)</label>

                        <textarea
                            value={data.project_description}
                            onChange={e => setData('project_description', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Project'}
                        </button>

                        <a
                            href="/admin/projects"
                            className="px-6 py-2.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}