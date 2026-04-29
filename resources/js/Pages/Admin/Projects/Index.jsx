// This file is for the "Projects List" page in the admin dashboard. It displays a searchable and paginated table of all projects, with options to edit or delete each project.
// It also shows flash messages for actions performed and includes a hover tooltip for project notes.

import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

// Main component for displaying the list of projects in the admin dashboard
export default function Index({ projects, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? "");
    const [hoveredNote, setHoveredNote] = useState(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

    // Handle search input changes and update the project list via GET request with search query
    function handleSearch(e) {
        setSearch(e.target.value);
        router.get(
            "/admin/projects",
            { search: e.target.value },
            { preserveState: true, replace: true },
        );
    }

    //  Delete a project after confirmation, sending a POST request to the delete endpoint
    function deleteProject(project_id) {
        if (confirm("Are you sure you want to delete this project?")) {
            router.post(
                `/admin/projects/${project_id}/delete`,
                {},
                { preserveScroll: true },
            );
        }
    }

    // Handle hover event on the notes icon to show the tooltip with full project description
    function handleNoteHover(e, note) {
        const rect = e.target.getBoundingClientRect();
        setHoverPos({ x: rect.left, y: rect.top });
        setHoveredNote(note);
    }

    return (
      <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .tbl-row { transition: background 0.15s ease; }
                .tbl-row:hover { background: #f9fafb; }
                .action-pill { transition: all 0.2s ease; }
                .action-pill:hover { filter: brightness(0.94); transform: translateY(-1px); }
                .search-box:focus-within { border-color: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.1); }
                .pg-btn { transition: all 0.2s ease; }
                .pg-btn:hover:not(:disabled) { border-color: #15803d; color: #15803d; }
            `}</style>

            {/* ── PAGE HEADER ── */}
            <div style={{ marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between",
                animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) both" }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                        Admin Panel
                    </p>
                    <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:2 }}>Projects</h1>
                    <p style={{ fontSize:13, color:"#6b7280" }}>
                        All surveying projects — search and manage from here.
                    </p>
                </div>
                <Link
                    href="/admin/projects/create"
                    style={{
                        background:"linear-gradient(135deg,#064e3b,#065f46)",
                        color:"#fff", padding:"10px 20px", borderRadius:10,
                        fontSize:13, fontWeight:700, textDecoration:"none",
                        transition:"all 0.2s ease",
                        boxShadow:"0 4px 12px rgba(6,78,59,0.2)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform="translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
                >
                    + Add Project
                </Link>
            </div>

            {/* ── SEARCH ── */}
            <div style={{ marginBottom:16, animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.08s both" }}>
                <div className="search-box" style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    background:"#fff", border:"1.5px solid #e5e7eb",
                    borderRadius:10, padding:"8px 14px",
                    transition:"border-color 0.2s ease, box-shadow 0.2s ease",
                    width:300,
                }}>
                    <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search name, ID, location, service..."
                        style={{ outline:"none", background:"transparent", fontSize:12, color:"#374151", flex:1, border:"none" }}
                    />
                    {search && (
                        <button onClick={() => handleSearch({ target:{ value:"" } })}
                            style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:14, lineHeight:1, padding:0 }}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* ── EMPTY STATE ── */}
            {projects.data.length === 0 ? (
                <div style={{
                    background:"#fff", borderRadius:16, border:"1px solid #e5e7eb",
                    padding:"60px 20px", textAlign:"center",
                    animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.12s both",
                }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
                    <p style={{ color:"#6b7280", fontSize:14, fontWeight:600, marginBottom:4 }}>No projects found</p>
                    <p style={{ color:"#9ca3af", fontSize:12, marginBottom:20 }}>
                        {search ? "Try a different search term." : "Get started by adding your first project."}
                    </p>
                    {!search && (
                        <Link href="/admin/projects/create" style={{
                            background:"linear-gradient(135deg,#064e3b,#065f46)",
                            color:"#fff", padding:"10px 20px", borderRadius:10,
                            fontSize:13, fontWeight:700, textDecoration:"none",
                        }}>
                            Add First Project
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{
                    background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden",
                    animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.12s both",
                }}>
                    <table style={{ width:"100%", tableLayout:"fixed", borderCollapse:"collapse" }}>
                        <colgroup>
                            <col style={{ width:"10%" }} />
                            <col style={{ width:"18%" }} />
                            <col style={{ width:"15%" }} />
                            <col style={{ width:"11%" }} />
                            <col style={{ width:"18%" }} />
                            <col style={{ width:"10%" }} />
                            <col style={{ width:"18%" }} />
                        </colgroup>
                        <thead>
                            <tr style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
                                {["Project ID","Name","Location","Duration","Service","Added","Actions"].map(h => (
                                    <th key={h} style={{
                                        padding:"11px 16px", textAlign:"left",
                                        fontSize:10, fontWeight:700, color:"#9ca3af",
                                        textTransform:"uppercase", letterSpacing:"0.08em",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.data.map((project, i) => (
                                <tr key={project.id} className="tbl-row"
                                    style={{ borderBottom: i < projects.data.length - 1 ? "1px solid #f3f4f6" : "none" }}>

                                    {/* Project ID */}
                                    <td style={{ padding:"12px 16px" }}>
                                        <span style={{
                                            fontSize:11, fontWeight:700,
                                            color:"#15803d", background:"#dcfce7",
                                            padding:"3px 9px", borderRadius:99,
                                        }}>
                                            {project.project_id}
                                        </span>
                                    </td>

                                    {/* Name + Dates */}
                                    <td style={{ padding:"12px 16px" }}>
                                        <p style={{ fontSize:12, fontWeight:600, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                            {project.project_name}
                                        </p>
                                        <p style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>
                                            {new Date(project.project_start).toLocaleDateString("en-GB")} — {new Date(project.project_end).toLocaleDateString("en-GB")}
                                        </p>
                                    </td>

                                    {/* Location */}
                                    <td style={{ padding:"12px 16px", fontSize:12, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                        {project.project_location}
                                    </td>

                                    {/* Duration */}
                                    <td style={{ padding:"12px 16px", fontSize:12, color:"#374151" }}>
                                        {project.project_duration}
                                    </td>

                                    {/* Service */}
                                    <td style={{ padding:"12px 16px" }}>
                                        <span style={{
                                            fontSize:11, fontWeight:600,
                                            background:"#eff6ff", color:"#1d4ed8",
                                            padding:"3px 9px", borderRadius:99,
                                            display:"inline-block",
                                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                            maxWidth:"100%",
                                        }}>
                                            {project.project_services}
                                        </span>
                                    </td>

                                    {/* Added date */}
                                    <td style={{ padding:"12px 16px", fontSize:10, color:"#9ca3af" }}>
                                        {new Date(project.created_at).toLocaleDateString("en-MY", { day:"numeric", month:"short", year:"numeric" })}
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding:"12px 16px" }}>
                                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                            {/* Notes */}
                                            {project.project_description && (
                                                <div style={{ position:"relative", cursor:"help" }}
                                                    onMouseEnter={e => handleNoteHover(e, project.project_description)}
                                                    onMouseLeave={() => setHoveredNote(null)}>
                                                    <span className="action-pill" style={{
                                                        fontSize:11, color:"#15803d", background:"#f0fdf4",
                                                        padding:"4px 10px", borderRadius:99,
                                                        border:"1px solid #bbf7d0", cursor:"help",
                                                    }}>
                                                        Notes ℹ
                                                    </span>
                                                </div>
                                            )}
                                            {/* Edit */}
                                            <Link href={`/admin/projects/${project.project_id}/edit`}
                                                className="action-pill"
                                                style={{
                                                    fontSize:11, fontWeight:600,
                                                    background:"#fff7ed", color:"#c2410c",
                                                    padding:"4px 12px", borderRadius:99,
                                                    border:"1px solid #fed7aa",
                                                    textDecoration:"none",
                                                }}>
                                                Edit
                                            </Link>
                                            {/* Delete */}
                                            <button onClick={() => deleteProject(project.project_id)}
                                                className="action-pill"
                                                style={{
                                                    fontSize:11, fontWeight:600,
                                                    background:"#fef2f2", color:"#dc2626",
                                                    padding:"4px 12px", borderRadius:99,
                                                    border:"1px solid #fecaca",
                                                    cursor:"pointer",
                                                }}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ── PAGINATION ── */}
                    {projects.last_page > 1 && (
                        <div style={{
                            display:"flex", alignItems:"center", justifyContent:"space-between",
                            padding:"12px 18px", borderTop:"1px solid #f3f4f6",
                        }}>
                            <p style={{ fontSize:11, color:"#9ca3af" }}>
                                Showing <span style={{ fontWeight:600, color:"#374151" }}>{projects.from}–{projects.to}</span> of <span style={{ fontWeight:600, color:"#374151" }}>{projects.total}</span> records
                            </p>
                            <div style={{ display:"flex", gap:6 }}>
                                {projects.links.map((link, i) => (
                                    <button key={i}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className="pg-btn"
                                        style={{
                                            padding:"5px 11px", borderRadius:8,
                                            fontSize:12, fontWeight:600,
                                            background: link.active ? "linear-gradient(135deg,#064e3b,#065f46)" : "#fff",
                                            color: link.active ? "#fff" : "#374151",
                                            border: `1px solid ${link.active ? "#064e3b" : "#e5e7eb"}`,
                                            opacity: !link.url ? 0.35 : 1,
                                            cursor: !link.url ? "not-allowed" : "pointer",
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── NOTE TOOLTIP ── */}
            {hoveredNote && (
                <div style={{
                    position:"fixed",
                    top: Math.max(hoverPos.y - 10, 80) + "px",
                    left: Math.min(hoverPos.x, window.innerWidth - 320) + "px",
                    zIndex:9999, width:300,
                    background:"#1f2937", color:"#fff",
                    padding:"12px 14px", borderRadius:12,
                    fontSize:12, lineHeight:1.6,
                    boxShadow:"0 8px 24px rgba(0,0,0,0.25)",
                    pointerEvents:"none",
                }}>
                    <p style={{ fontSize:10, color:"#9ca3af", marginBottom:6, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        Notes
                    </p>
                    {hoveredNote}
                </div>
            )}
        </AdminLayout>
    );
}
