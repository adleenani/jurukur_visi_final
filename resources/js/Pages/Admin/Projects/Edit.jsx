// Projects/Edit.jsx — Edit an existing surveying project.

import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm, Link } from "@inertiajs/react";

const services = [
    "Consultation Services",
    "Cadastral Survey",
    "Engineering Survey",
    "Topographic Survey",
    "Hydrographic Survey",
    "Photogrammetric Mapping",
    "Underground Detection & Utilities Mapping",
];

function calcDuration(start, end) {
    if (!start || !end) return "";
    const s = new Date(start),
        e = new Date(end);
    if (e < s) return "⚠ End date must be after start date";
    const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24));
    const years = Math.floor(diff / 365);
    const months = Math.floor((diff % 365) / 30);
    const days = diff % 30;
    let r = "";
    if (years) r += `${years} Year(s), `;
    if (months) r += `${months} Month(s), `;
    r += `${days} Day(s)`;
    return r;
}

function Field({ label, error, hint, children }) {
    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 5,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                    {hint}
                </p>
            )}
            {error && (
                <p style={{ fontSize: 10, color: "#dc2626", marginTop: 3 }}>
                    {error}
                </p>
            )}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    border: "1.5px solid #e5e7eb",
    borderRadius: 9,
    padding: "10px 13px",
    fontSize: 13,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    background: "#fff",
};
const onFocus = (e) => {
    e.target.style.borderColor = "#4ade80";
    e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)";
};
const onBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
};

export default function Edit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        project_name: project.project_name ?? "",
        project_start: project.project_start ?? "",
        project_end: project.project_end ?? "",
        project_location: project.project_location ?? "",
        project_services: project.project_services ?? "",
        project_description: project.project_description ?? "",
        status: project.status ?? "completed",
    });

    function submit(e) {
        e.preventDefault();
        put(`/admin/projects/${project.project_id}`);
    }

    const duration = calcDuration(data.project_start, data.project_end);

    return (
        <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .cancel-btn:hover { background: #f3f4f6 !important; }
            `}</style>

            {/* ── HEADER ── */}
            <div
                style={{
                    marginBottom: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1) both",
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                        }}
                    >
                        PIC Panel · Projects
                    </p>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#111827",
                            marginBottom: 2,
                        }}
                    >
                        Edit Project
                    </h1>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                        Updating:{" "}
                        <span style={{ color: "#064e3b", fontWeight: 700 }}>
                            {project.project_name}
                        </span>
                    </p>
                </div>
                <Link
                    href="/admin/projects"
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#6b7280",
                        background: "#fff",
                        border: "1.5px solid #e5e7eb",
                        padding: "9px 18px",
                        borderRadius: 10,
                        textDecoration: "none",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background = "#fff";
                    }}
                >
                    ← Back to Projects
                </Link>
            </div>

            {/* ── FORM CARD ── */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    animation:
                        "fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.08s both",
                }}
            >
                {/* Card header — amber tint to differentiate from create */}
                <div
                    style={{
                        padding: "16px 28px",
                        borderBottom: "1px solid #f3f4f6",
                        background: "#fffbeb",
                    }}
                >
                    <p
                        style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#92400e",
                        }}
                    >
                        Edit Project Details
                    </p>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                        Project ID cannot be changed. All other fields are
                        editable.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    style={{
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    {/* Row 1: ID (locked) · Name · Status */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                            gap: 16,
                        }}
                    >
                        <Field label="Project ID" hint="Cannot be changed">
                            <input
                                type="text"
                                value={project.project_id}
                                disabled
                                style={{
                                    ...inputStyle,
                                    background: "#f9fafb",
                                    color: "#9ca3af",
                                    cursor: "not-allowed",
                                }}
                            />
                        </Field>
                        <Field label="Project Name" error={errors.project_name}>
                            <input
                                type="text"
                                value={data.project_name}
                                onChange={(e) =>
                                    setData("project_name", e.target.value)
                                }
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="Project name"
                                required
                            />
                        </Field>
                         <Field label="Start Date" error={errors.project_start}>
                            <input
                                type="date"
                                value={data.project_start}
                                onChange={(e) =>
                                    setData("project_start", e.target.value)
                                }
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                required
                            />
                        </Field>
                        <Field label="End Date" error={errors.project_end}>
                            <input
                                type="date"
                                value={data.project_end}
                                onChange={(e) =>
                                    setData("project_end", e.target.value)
                                }
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                required
                            />
                        </Field>
                        {/* Duration pill */}
                        {duration && (
                            <Field label="Duration">
                                <div
                                    style={{
                                        ...inputStyle,
                                        background: duration.startsWith("⚠")
                                            ? "#fef2f2"
                                            : "#f9fafb",
                                        color: duration.startsWith("⚠")
                                            ? "#dc2626"
                                            : "#6b7280",
                                        cursor: "default",
                                    }}
                                >
                                    {duration.startsWith("⚠")
                                        ? duration
                                        : `⏱ ${duration}`}
                                </div>
                            </Field>
                        )}
                    </div>

                    {/* Row 2: Start Date · End Date · Location */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr",
                            gap: 16,
                        }}
                    >
                        <Field
                            label="Project Location"
                            error={errors.project_location}
                        >
                            <input
                                type="text"
                                value={data.project_location}
                                onChange={(e) =>
                                    setData("project_location", e.target.value)
                                }
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="e.g. Kuala Lumpur"
                                required
                            />
                        </Field>
                        <Field
                            label="Service Type"
                            error={errors.project_services}
                        >
                            <select
                                value={data.project_services}
                                onChange={(e) =>
                                    setData("project_services", e.target.value)
                                }
                                style={{ ...inputStyle, cursor: "pointer" }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                required
                            >
                                <option value="">-- Select a service --</option>
                                {services.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Row 4: Description (full width) */}
                    <Field label="Description (optional)">
                        <textarea
                            value={data.project_description}
                            onChange={(e) =>
                                setData("project_description", e.target.value)
                            }
                            rows={4}
                            style={{ ...inputStyle, resize: "none" }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Brief description of the project scope, client, or notes..."
                        />
                    </Field>

                    <div style={{ height: 1, background: "#f3f4f6" }} />

                    {/* Actions */}
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                background:
                                    "linear-gradient(135deg,#064e3b,#065f46)",
                                color: "#fff",
                                padding: "10px 28px",
                                borderRadius: 9,
                                fontSize: 13,
                                fontWeight: 700,
                                border: "none",
                                cursor: processing ? "not-allowed" : "pointer",
                                opacity: processing ? 0.6 : 1,
                                transition: "all 0.2s",
                            }}
                        >
                            {processing ? "Updating..." : "Update Project"}
                        </button>
                        <Link
                            href="/admin/projects"
                            className="cancel-btn"
                            style={{
                                padding: "10px 20px",
                                borderRadius: 9,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#6b7280",
                                background: "#fff",
                                border: "1.5px solid #e5e7eb",
                                textDecoration: "none",
                                transition: "all 0.2s",
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
