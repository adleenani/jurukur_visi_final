// Projects.jsx — Enhanced project portfolio page for Jurukur Visi Sdn Bhd.

import PublicLayout from "../Layouts/PublicLayout";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const ob = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVis(true);
            },
            { threshold: 0.08 },
        );
        if (ref.current) ob.observe(ref.current);
        return () => ob.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   SERVICE TAG
───────────────────────────────────────────── */
function ServiceTag({ label }) {
    const colors = [
        { bg: "#d1fae5", color: "#065f46" },
        { bg: "#dbeafe", color: "#1e40af" },
        { bg: "#fef9c3", color: "#854d0e" },
        { bg: "#ede9fe", color: "#6d28d9" },
        { bg: "#cffafe", color: "#155e75" },
        { bg: "#ffedd5", color: "#9a3412" },
    ];
    const pick =
        colors[Math.abs(label.charCodeAt(0) + label.length) % colors.length];
    return (
        <span
            style={{
                background: pick.bg,
                color: pick.color,
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 99,
                whiteSpace: "nowrap",
            }}
        >
            {label}
        </span>
    );
}

/* ─────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────── */
function ProjectCard({ project, index }) {
    const [imgErr, setImgErr] = useState(false);
    const isActive = project.status === "active";

    const serviceList = project.project_services
        ? project.project_services
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

    return (
        <Reveal delay={index * 70}>
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
                    cursor: "default",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 48px rgba(6,78,59,0.10)";
                    e.currentTarget.style.borderColor = "#bbf7d0";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                }}
            >
                {/* ── LEFT: Image ── */}
                <div
                    style={{
                        position: "relative",
                        minHeight: 200,
                        background: "#f0fdf4",
                        overflow: "hidden",
                    }}
                >
                    {project.image_url && !imgErr ? (
                        <img
                            src={project.image_url}
                            alt={project.project_name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                transition:
                                    "transform 0.5s cubic-bezier(.22,1,.36,1)",
                            }}
                            onError={() => setImgErr(true)}
                            onMouseEnter={(e) =>
                                (e.target.style.transform = "scale(1.06)")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.transform = "scale(1)")
                            }
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                minHeight: 200,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background:
                                    "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                                backgroundImage:
                                    "radial-gradient(circle,#bbf7d0 1px,transparent 1px)",
                                backgroundSize: "20px 20px",
                            }}
                        >
                            <span style={{ fontSize: 36 }}>🗺️</span>
                            <span
                                style={{
                                    fontSize: 11,
                                    color: "#6ee7b7",
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Survey Project
                            </span>
                        </div>
                    )}

                    {/* Status badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            background: isActive ? "#4ade80" : "#e5e7eb",
                            color: isActive ? "#052e16" : "#6b7280",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 99,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: isActive ? "#166534" : "#9ca3af",
                                display: "inline-block",
                                animation: isActive
                                    ? "glowPulse 2s ease infinite"
                                    : "none",
                            }}
                        />
                        {isActive ? "Active" : "Completed"}
                    </div>
                </div>

                {/* ── RIGHT: Info ── */}
                <div
                    style={{
                        padding: "22px 24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontWeight: 700,
                                color: "#064e3b",
                                fontSize: 15,
                                lineHeight: 1.4,
                                marginBottom: 4,
                            }}
                        >
                            {project.project_name}
                        </h3>
                        {project.client_name && (
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "#9ca3af",
                                    fontWeight: 500,
                                }}
                            >
                                {project.client_name}
                            </p>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                        }}
                    >
                        {[
                            { icon: "📍", text: project.project_location },
                            {
                                icon: "📅",
                                text: `${project.project_start} — ${project.project_end}`,
                            },
                            { icon: "⏱", text: project.project_duration },
                        ]
                            .filter((r) => r.text)
                            .map(({ icon, text }) => (
                                <div
                                    key={icon}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <span
                                        style={{ fontSize: 13, flexShrink: 0 }}
                                    >
                                        {icon}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "#6b7280",
                                        }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            ))}
                    </div>

                    {serviceList.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 5,
                            }}
                        >
                            {serviceList.map((s) => (
                                <ServiceTag key={s} label={s} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Reveal>
    );
}

/* ─────────────────────────────────────────────
   STAT PILL / FILTER TAB
───────────────────────────────────────────── */
function StatPill({ label, value, color, bg, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 99,
                border: `1.5px solid ${active ? color : "rgba(255,255,255,0.2)"}`,
                background: active ? bg : "rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.25s ease",
                transform: active ? "scale(1.04)" : "scale(1)",
            }}
        >
            <span
                style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: active ? color : "#fff",
                }}
            >
                {value}
            </span>
            <span
                style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: active ? color : "rgba(255,255,255,0.7)",
                    letterSpacing: "0.04em",
                }}
            >
                {label}
            </span>
        </button>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Projects({ projects }) {
    const [filter, setFilter] = useState("all");

    const total = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const active = projects.filter((p) => p.status === "active").length;

    const filtered =
        filter === "all"
            ? projects
            : filter === "active"
              ? projects.filter((p) => p.status === "active")
              : projects.filter((p) => p.status === "completed");

    return (
        <PublicLayout>
            <style>{`
                @keyframes glowPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }
                @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
            `}</style>

            <div className="min-h-screen" style={{ background: "#f8fafb" }}>
                {/* ── HERO STRIP ── */}
                <div
                    style={{
                        background:
                            "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                        backgroundSize: "300% 300%",
                        animation: "gradShift 8s ease infinite",
                        padding: "52px 24px 36px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: -60,
                            right: -60,
                            width: 220,
                            height: 220,
                            borderRadius: "50%",
                            border: "1px solid rgba(110,231,183,0.12)",
                            pointerEvents: "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: -40,
                            left: -40,
                            width: 160,
                            height: 160,
                            borderRadius: "50%",
                            border: "1px solid rgba(110,231,183,0.1)",
                            pointerEvents: "none",
                        }}
                    />

                    <div
                        className="max-w-6xl mx-auto"
                        style={{ position: "relative", zIndex: 1 }}
                    >
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#4ade80",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            Our Portfolio
                        </span>
                        <h1
                            style={{
                                fontSize: 32,
                                fontWeight: 800,
                                color: "#fff",
                                marginTop: 6,
                                marginBottom: 6,
                            }}
                        >
                            Project Portfolio
                        </h1>
                        <p
                            style={{
                                color: "#6ee7b7",
                                fontSize: 14,
                                marginBottom: 28,
                            }}
                        >
                            Surveying and mapping projects completed across
                            Malaysia.
                        </p>
                    </div>
                </div>

                {/* ── PROJECT LIST ── */}
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {filtered.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "80px 0",
                                color: "#9ca3af",
                            }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 12 }}>
                                📂
                            </div>
                            <p style={{ fontWeight: 600 }}>
                                No projects in this category yet.
                            </p>
                            <p style={{ fontSize: 13, marginTop: 4 }}>
                                Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                            }}
                        >
                            {filtered.map((project, i) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
