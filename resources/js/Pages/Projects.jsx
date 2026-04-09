import Navbar from "../Components/Navbar";

const statusStyle = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-500",
};

export default function Projects({ projects }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h1 className="text-3xl font-medium text-green-800 mb-2">
                    Project Portfolio
                </h1>
                <p className="text-gray-500 mb-10">
                    Surveying and mapping projects completed across Malaysia.
                </p>

                {projects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No projects yet. Check back soon.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-sm transition"
                            >
                                <h3 className="font-medium text-green-800 mb-1">
                                    {project.project_name}
                                </h3>
                                <p className="text-xs text-gray-400 mb-4">
                                    #{project.project_id}
                                </p>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <p>📍 {project.project_location}</p>
                                    <p>
                                        📅 {project.project_start} —{" "}
                                        {project.project_end}
                                    </p>
                                    <p>⏱ {project.project_duration}</p>
                                    <p>🛠 {project.project_services}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
