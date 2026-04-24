import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ projects }) {
    const { flash } = usePage().props;
    const [hoveredNote, setHoveredNote] = useState(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

    function deleteProject(project_id) {
        if (confirm("Are you sure you want to delete this project?")) {
            router.post(
                `/admin/projects/${project_id}/delete`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    }

    function handleNoteHover(e, note) {
        const rect = e.target.getBoundingClientRect();
        setHoverPos({ x: rect.left, y: rect.top });
        setHoveredNote(note);
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl text-gray-900">
                        Projects
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All completed surveying projects.
                    </p>
                </div>
                <Link
                    href="/admin/projects/create"
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition"
                    style={{ background: "#15803d" }}
                >
                    + Add Project
                </Link>
            </div>

            {/* Flash messages */}
            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
                    {flash.success}
                </div>
            )}

            {/* Table */}
            {projects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 px-6 py-20 text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        No projects yet.
                    </p>
                    <Link
                        href="/admin/projects/create"
                        className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
                        style={{ background: "#15803d" }}
                    >
                        Add First Project
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full" style={{ tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "16%" }} />
                            <col style={{ width: "16%" }} />
                            <col style={{ width: "14%" }} />
                            <col style={{ width: "16%" }} />
                            <col style={{ width: "18%" }} />
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
                                    "Project ID",
                                    "Name",
                                    "Location",
                                    "Duration",
                                    "Service",
                                    "Notes",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left font-semibold text-gray-500"
                                        style={{ fontSize: "13px" }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    style={{
                                        borderBottom: "0.5px solid #f3f4f6",
                                    }}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {/* Project ID */}
                                    <td className="px-4 py-4">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontSize: "13px",
                                                color: "#15803d",
                                                background: "#d1fae5",
                                                padding: "3px 10px",
                                                borderRadius: "99px",
                                            }}
                                        >
                                            {project.project_id}
                                        </span>
                                    </td>

                                    {/* Name + dates */}
                                    <td className="px-4 py-4">
                                        <p
                                            className="font-semibold text-gray-800"
                                            style={{ fontSize: "13px" }}
                                        >
                                            {project.project_name}
                                        </p>
                                        <p
                                            className="text-gray-400 mt-1"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {project.project_start} —{" "}
                                            {project.project_end}
                                        </p>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-4">
                                        <p
                                            className="text-gray-600"
                                            style={{ fontSize: "13px" }}
                                        >
                                            {project.project_location}
                                        </p>
                                    </td>

                                    {/* Duration */}
                                    <td className="px-4 py-4">
                                        <p
                                            className="text-gray-600"
                                            style={{ fontSize: "13px" }}
                                        >
                                            {project.project_duration}
                                        </p>
                                    </td>

                                    {/* Service badge */}
                                    <td className="px-4 py-4">
                                        <span
                                            className="font-semibold"
                                            style={{
                                                fontSize: "12px",
                                                background: "#eff6ff",
                                                color: "#1d4ed8",
                                                padding: "4px 10px",
                                                borderRadius: "99px",
                                                display: "inline-block",
                                                lineHeight: "1.4",
                                            }}
                                        >
                                            {project.project_services}
                                        </span>
                                    </td>

                                    {/* Notes with hover popup */}
                                    <td className="px-4 py-4">
                                        {project.project_description ? (
                                            <div
                                                className="relative cursor-pointer"
                                                onMouseEnter={(e) =>
                                                    handleNoteHover(
                                                        e,
                                                        project.project_description,
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredNote(null)
                                                }
                                            >
                                                <p
                                                    className="text-gray-500"
                                                    style={{
                                                        fontSize: "13px",
                                                        lineHeight: "1.5",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow: "hidden",
                                                        borderLeft:
                                                            "2px solid #d1fae5",
                                                        paddingLeft: "8px",
                                                    }}
                                                >
                                                    {
                                                        project.project_description
                                                    }
                                                </p>
                                                {project.project_description
                                                    .length > 100 && (
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#15803d",
                                                            marginTop: "3px",
                                                        }}
                                                    >
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#d1d5db",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                No notes
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <Link
                                                href={`/admin/projects/${project.project_id}/edit`}
                                                className="text-center font-semibold transition"
                                                style={{
                                                    fontSize: "12px",
                                                    background: "#fff7ed",
                                                    color: "#c2410c",
                                                    padding: "4px 10px",
                                                    borderRadius: "99px",
                                                    border: "0.5px solid #fed7aa",
                                                }}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deleteProject(
                                                        project.project_id,
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Hover popup for full notes */}
            {hoveredNote && (
                <div
                    style={{
                        position: "fixed",
                        top: Math.max(hoverPos.y - 10, 80) + "px",
                        left:
                            Math.min(hoverPos.x, window.innerWidth - 320) +
                            "px",
                        zIndex: 9999,
                        width: "300px",
                        background: "#1f2937",
                        color: "white",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                    }}
                >
                    <p
                        style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                    </p>
                    {hoveredNote}
                </div>
            )}
        </AdminLayout>
    );
}
