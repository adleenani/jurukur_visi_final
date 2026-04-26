import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ projects, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? "");
    const [hoveredNote, setHoveredNote] = useState(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

    function handleSearch(e) {
        setSearch(e.target.value);
        router.get(
            "/admin/projects",
            { search: e.target.value },
            { preserveState: true, replace: true },
        );
    }

    function deleteProject(project_id) {
        if (confirm("Are you sure you want to delete this project?")) {
            router.post(
                `/admin/projects/${project_id}/delete`,
                {},
                { preserveScroll: true },
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
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Projects
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All completed surveying projects — search and manage
                        from here.
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

            {flash?.success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
                    {flash.success}
                </div>
            )}

            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 mb-4 w-fit">
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
                    placeholder="Search name, ID, location, service..."
                    className="outline-none bg-transparent text-gray-700"
                    style={{
                        fontSize: "12px",
                        fontFamily: "Raleway, sans-serif",
                        width: "220px",
                    }}
                />
            </div>

            {/* Table */}
            {projects.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 px-6 py-20 text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        No projects found.
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
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "18%" }} />
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
                                    "Added",
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
                            {projects.data.map((project) => (
                                <tr
                                    key={project.id}
                                    style={{
                                        borderBottom: "0.5px solid #f3f4f6",
                                    }}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontSize: "11px",
                                                color: "#15803d",
                                                background: "#d1fae5",
                                                padding: "3px 8px",
                                                borderRadius: "99px",
                                            }}
                                        >
                                            {project.project_id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p
                                            className="font-semibold text-gray-800 truncate"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {project.project_name}
                                        </p>
                                        <p
                                            className="text-gray-400 mt-0.5"
                                            style={{ fontSize: "10px" }}
                                        >
                                            {project.project_start} —{" "}
                                            {project.project_end}
                                        </p>
                                    </td>
                                    <td
                                        className="px-4 py-3 text-gray-600 truncate"
                                        style={{ fontSize: "12px" }}
                                    >
                                        {project.project_location}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-gray-600"
                                        style={{ fontSize: "12px" }}
                                    >
                                        {project.project_duration}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-semibold"
                                            style={{
                                                fontSize: "11px",
                                                background: "#eff6ff",
                                                color: "#1d4ed8",
                                                padding: "3px 8px",
                                                borderRadius: "99px",
                                                display: "inline-block",
                                            }}
                                        >
                                            {project.project_services}
                                        </span>
                                    </td>
                                    <td
                                        className="px-4 py-3 text-gray-400"
                                        style={{ fontSize: "10px" }}
                                    >
                                        {new Date(
                                            project.created_at,
                                        ).toLocaleDateString("en-MY", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {project.project_description && (
                                                <div
                                                    className="relative cursor-help"
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
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#15803d",
                                                            background:
                                                                "#f0fdf4",
                                                            padding: "3px 8px",
                                                            borderRadius:
                                                                "99px",
                                                            border: "0.5px solid #bbf7d0",
                                                        }}
                                                    >
                                                        Notes ℹ
                                                    </span>
                                                </div>
                                            )}
                                            <Link
                                                href={`/admin/projects/${project.project_id}/edit`}
                                                className="font-semibold transition"
                                                style={{
                                                    fontSize: "11px",
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
                                                    fontSize: "11px",
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

                    {/* Pagination */}
                    {projects.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Showing {projects.from}–{projects.to} of{" "}
                                {projects.total} records
                            </p>
                            <div className="flex gap-1.5">
                                {projects.links.map((link, i) => (
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
            )}

            {/* Note hover popup */}
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
                        fontSize: "12px",
                        lineHeight: "1.6",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                    }}
                >
                    <p
                        style={{
                            fontSize: "10px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Full Notes
                    </p>
                    {hoveredNote}
                </div>
            )}
        </AdminLayout>
    );
}
