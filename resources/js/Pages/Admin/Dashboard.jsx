// Dashboard page for the PIC Panel, showing key stats and recent activity

import ToastContainer from "../../Components/ToastContainer";
import AdminLayout from "../../Layouts/AdminLayout";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   COUNTER — smooth count-up
───────────────────────────────────────────── */
function Counter({ target }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const dur = 1200, step = 16;
                const inc = target / (dur / step);
                let cur = 0;
                const t = setInterval(() => {
                    cur += inc;
                    if (cur >= target) { setCount(target); clearInterval(t); }
                    else setCount(Math.floor(cur));
                }, step);
            }
        });
        if (ref.current) ob.observe(ref.current);
        return () => ob.disconnect();
    }, [target]);
    return <span ref={ref}>{count}</span>;
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, icon, accent, bg, delay }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const t = setTimeout(() => setVis(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div ref={ref} style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: "20px 22px",
            position: "relative",
            overflow: "hidden",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.5s ease, transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease, border-color 0.25s ease`,
            cursor: "default",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${accent}22`;
                e.currentTarget.style.borderColor = accent + "55";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Left accent bar */}
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:accent, borderRadius:"16px 0 0 16px" }} />

            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", paddingLeft:8 }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>
                        {label}
                    </p>
                    <p style={{ fontSize:32, fontWeight:800, color:"#111827", lineHeight:1 }}>
                        <Counter target={value} />
                    </p>
                </div>
                <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ title, href, linkLabel, color }) {
    return (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:color, borderRadius:"14px 14px 0 0" }}>
            <p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{title}</p>
            <Link href={href} style={{
                fontSize:11, fontWeight:600, color:"#fff",
                background:"rgba(255,255,255,0.18)", padding:"4px 12px",
                borderRadius:99, textDecoration:"none",
                transition:"background 0.2s",
            }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.28)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}
            >
                {linkLabel} →
            </Link>
        </div>
    );
}

/* ─────────────────────────────────────────────
   AVATAR INITIALS
───────────────────────────────────────────── */
function Avatar({ name, bg, color }) {
    const parts = name.trim().split(" ");
    const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    return (
        <div style={{ width:36, height:36, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
            {initials}
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Dashboard({
    stats = { total:0, recent:[], pending_bookings:0, pending_booking_list:[], total_bookings:0, total_users:0 },
}) {
    const { auth } = usePage().props;

    const statCards = [
        { label:"Total Projects",   value:stats.total,              icon:"📁", accent:"#15803d", bg:"#dcfce7" },
        { label:"Pending Bookings", value:stats.pending_bookings,   icon:"📅", accent:"#d97706", bg:"#fef9c3" },
        { label:"Total Bookings",   value:stats.total_bookings ?? 0,icon:"📊", accent:"#2563eb", bg:"#dbeafe" },
        { label:"Total Staff",      value:stats.total_users ?? 0,   icon:"👤", accent:"#7c3aed", bg:"#ede9fe" },
    ];

    return (
        <AdminLayout>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .row-item { transition: background 0.2s ease; }
                .row-item:hover { background: #f9fafb; }
                .action-btn { transition: all 0.2s ease; }
                .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
            `}</style>

            <ToastContainer />

            {/* ── PAGE HEADER ── */}
            <div style={{ marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between",
                animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) both" }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                        PIC Panel
                    </p>
                    <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:2 }}>Dashboard</h1>
                    <p style={{ fontSize:13, color:"#6b7280" }}>
                        Welcome back, <span style={{ fontWeight:700, color:"#064e3b" }}>{auth?.user ?? "Admin"}</span>. Here's what's happening today.
                    </p>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                    <Link href="/admin/projects/create"
                        className="action-btn"
                        style={{
                            background:"linear-gradient(135deg,#064e3b,#065f46)",
                            color:"#fff", padding:"9px 18px", borderRadius:10,
                            fontSize:13, fontWeight:700, textDecoration:"none",
                            display:"flex", alignItems:"center", gap:6,
                        }}>
                        + Add Project
                    </Link>
                    <Link href="/admin/bookings"
                        className="action-btn"
                        style={{
                            background:"#fff", color:"#064e3b",
                            border:"1.5px solid #bbf7d0",
                            padding:"9px 18px", borderRadius:10,
                            fontSize:13, fontWeight:700, textDecoration:"none",
                            display:"flex", alignItems:"center", gap:6,
                        }}>
                        Manage Bookings
                    </Link>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                {statCards.map(({ label, value, icon, accent, bg }, i) => (
                    <StatCard key={label} label={label} value={value} icon={icon} accent={accent} bg={bg} delay={i * 80} />
                ))}
            </div>

            {/* ── TWO COLUMN BODY ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

                {/* ── RECENT PROJECTS ── */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden",
                    animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.2s both" }}>
                    <SectionHeader title="🕐 Recent Projects" href="/admin/projects" linkLabel="View all" color="#15803d" />
                    <div>
                        {stats.recent.length === 0 ? (
                            <div style={{ padding:"40px 20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                                No projects yet.{" "}
                                <Link href="/admin/projects/create" style={{ color:"#15803d", fontWeight:600 }}>Add one!</Link>
                            </div>
                        ) : (
                            stats.recent.map((project, i) => (
                                <div key={project.id} className="row-item"
                                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px",
                                        borderBottom: i < stats.recent.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                                    <Avatar name={project.project_name} bg="#dcfce7" color="#15803d" />
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <p style={{ fontSize:13, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                            {project.project_name}
                                        </p>
                                        <p style={{ fontSize:11, color:"#9ca3af", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                            📍 {project.project_location} · {project.project_services}
                                        </p>
                                    </div>
                                    <span style={{ fontSize:10, fontWeight:700, color:"#15803d", background:"#dcfce7", padding:"3px 10px", borderRadius:99, flexShrink:0 }}>
                                        Completed
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── PENDING BOOKINGS ── */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden",
                    animation:"fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.3s both" }}>
                    <SectionHeader title="📅 Pending Bookings" href="/admin/bookings" linkLabel="View all" color="#d97706" />
                    <div>
                        {(stats.pending_booking_list ?? []).length === 0 ? (
                            <div style={{ padding:"40px 20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                                No pending bookings 🎉
                            </div>
                        ) : (
                            stats.pending_booking_list.map((booking, i) => (
                                <div key={booking.id} className="row-item"
                                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px",
                                        borderBottom: i < stats.pending_booking_list.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                                    <Avatar name={booking.name} bg="#fef9c3" color="#854d0e" />
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <p style={{ fontSize:13, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                            {booking.name}
                                        </p>
                                        <p style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                                            {booking.service_type} · {booking.preferred_date}
                                        </p>
                                    </div>
                                    <span style={{ fontSize:10, fontWeight:700, color:"#854d0e", background:"#fef9c3", padding:"3px 10px", borderRadius:99, flexShrink:0 }}>
                                        Pending
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}