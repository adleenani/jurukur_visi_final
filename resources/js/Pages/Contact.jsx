// Contact page with consultation booking form and booking status checker.

import PublicLayout from "../Layouts/PublicLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const services = [
    "Consultation Services",
    "Cadastral Survey",
    "Engineering Survey",
    "Topographic Survey",
    "Hydrographic Survey",
    "Photogrammetric Mapping",
    "Underground Detection & Utilities Mapping",
];

const statusConfig = {
    pending: {
        color: "#854d0e", bg: "#fef9c3", icon: "⏳",
        title: "Pending Confirmation",
        desc: "Your booking request has been received and is awaiting confirmation. We will get back to you within 1–2 business days.",
    },
    confirmed: {
        color: "#065f46", bg: "#d1fae5", icon: "✓",
        title: "Booking Confirmed",
        desc: "Your consultation has been confirmed! Please see the details below for your scheduled appointment.",
    },
    rescheduled: {
        color: "#1e40af", bg: "#dbeafe", icon: "📅",
        title: "Booking Rescheduled",
        desc: "Your consultation has been rescheduled. Please see the updated appointment details below.",
    },
    cancelled: {
        color: "#991b1b", bg: "#fee2e2", icon: "✕",
        title: "Booking Cancelled",
        desc: "Unfortunately your booking has been cancelled. Please contact us or submit a new booking.",
    },
};

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
        if (ref.current) ob.observe(ref.current);
        return () => ob.disconnect();
    }, []);
    return (
        <div ref={ref} className={className} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        }}>
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────── */
function Field({ label, error, children }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, letterSpacing: "0.02em" }}>
                {label}
            </label>
            {children}
            {error && <p style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>{error}</p>}
        </div>
    );
}

const inputStyle = {
    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "10px 14px", fontSize: 13, outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
};

/* ─────────────────────────────────────────────
   DETAIL ROW (popup)
───────────────────────────────────────────── */
function DetailRow({ label, value }) {
    if (!value) return null;
    return (
        <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0, width: 90 }}>{label}</span>
            <span style={{ fontSize: 11, color: "#374151", fontWeight: 600, flex: 1, wordBreak: "break-word" }}>{value}</span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Contact() {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        service_type: "",
        preferred_date: "",
        consultation_type: "online",
        message: "",
    });

    function submitBooking(e) {
        e.preventDefault();
        post("/contact", { onSuccess: () => reset() });
    }

    const [showPopup,    setShowPopup]    = useState(false);
    const [refNumber,    setRefNumber]    = useState("");
    const [checking,     setChecking]     = useState(false);
    const [searched,     setSearched]     = useState(false);
    const [foundBooking, setFoundBooking] = useState(null);
    const [heroReady,    setHeroReady]    = useState(false);

    useEffect(() => { const t = setTimeout(() => setHeroReady(true), 80); return () => clearTimeout(t); }, []);

    function openPopup()  { setShowPopup(true);  setSearched(false); setFoundBooking(null); setRefNumber(""); }
    function closePopup() { setShowPopup(false); setSearched(false); setFoundBooking(null); setRefNumber(""); }

    async function checkBooking(e) {
        e.preventDefault();
        if (!refNumber.trim()) return;
        setChecking(true);
        try {
            const res = await axios.post("/check-booking", { reference_number: refNumber });
            setFoundBooking(res.data.found ? res.data.booking : null);
            setSearched(true);
        } catch {
            setSearched(true); setFoundBooking(null);
        } finally {
            setChecking(false);
        }
    }

    const status = foundBooking ? (statusConfig[foundBooking.status] ?? statusConfig.pending) : null;

    // Focus ring on input hover
    const focusStyle = (e) => e.target.style.borderColor = "#4ade80";
    const blurStyle  = (e) => e.target.style.borderColor = "#e5e7eb";

    return (
        <PublicLayout>
            <style>{`
                @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @keyframes shimmer    { 0%{left:-60%} 100%{left:120%} }
                @keyframes lbIn      { from{opacity:0} to{opacity:1} }
                @keyframes scIn      { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
                @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.4)} 50%{box-shadow:0 0 0 8px rgba(74,222,128,0)} }
                .shimmer-btn { position:relative; overflow:hidden; }
                .shimmer-btn::after { content:''; position:absolute; top:0; left:-60%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); animation:shimmer 2.8s infinite; }
            `}</style>

            {/* ── HERO STRIP ── */}
            <div style={{
                background: "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                backgroundSize: "300% 300%",
                animation: "gradShift 8s ease infinite",
                padding: "52px 24px 40px",
                position: "relative", overflow: "hidden",
            }}>
                {/* Rings */}
                <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", border:"1px solid rgba(110,231,183,0.12)", pointerEvents:"none" }} />
                <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", border:"1px solid rgba(110,231,183,0.1)", pointerEvents:"none" }} />

                <div className="max-w-6xl mx-auto" style={{ position:"relative", zIndex:1 }}>
                    <div style={{ opacity:heroReady?1:0, transform:heroReady?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease 0ms" }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#4ade80", letterSpacing:"0.15em", textTransform:"uppercase" }}>
                            Get In Touch
                        </span>
                    </div>
                    <div style={{ opacity:heroReady?1:0, transform:heroReady?"translateY(0)":"translateY(24px)", transition:"all 0.7s ease 100ms" }}>
                        <h1 style={{ fontSize:32, fontWeight:800, color:"#fff", marginTop:6, marginBottom:6 }}>
                            Book a Consultation
                        </h1>
                    </div>
                    <div style={{ opacity:heroReady?1:0, transform:heroReady?"translateY(0)":"translateY(24px)", transition:"all 0.7s ease 180ms" }}>
                        <p style={{ color:"#6ee7b7", fontSize:14 }}>
                            Fill in the form and our team will confirm your appointment within 1–2 business days.
                        </p>
                    </div>

                    {/* Quick info pills */}
                    <div style={{ opacity:heroReady?1:0, transform:heroReady?"translateY(0)":"translateY(24px)", transition:"all 0.7s ease 260ms",
                        display:"flex", gap:10, flexWrap:"wrap", marginTop:20 }}>
                        {[
                            { icon:"📍", text:"Sungai Buloh, Selangor" },
                            { icon:"📞", text:"+03-6038 8523" },
                            { icon:"✉️", text:"info@jurukurvisi.com" },
                            { icon:"🕐", text:"Mon–Fri, 9am–5pm" },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{
                                display:"flex", alignItems:"center", gap:7,
                                background:"rgba(255,255,255,0.08)",
                                border:"1px solid rgba(255,255,255,0.12)",
                                borderRadius:99, padding:"6px 14px",
                                fontSize:12, color:"rgba(255,255,255,0.85)",
                            }}>
                                <span style={{ fontSize:13 }}>{icon}</span>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ background:"#f8fafb", padding:"40px 24px 60px" }}>
                <div className="max-w-6xl mx-auto">
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }}>

                        {/* ── LEFT: BOOKING FORM ── */}
                        <Reveal delay={60}>
                            <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e5e7eb", padding:32 }}>
                                <h2 style={{ fontSize:17, fontWeight:800, color:"#064e3b", marginBottom:4 }}>
                                    Consultation Request
                                </h2>
                                <p style={{ fontSize:12, color:"#9ca3af", marginBottom:24 }}>
                                    All fields are required unless stated optional.
                                </p>

                                {flash.success && (
                                    <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#065f46", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:13 }}>
                                        ✓ {flash.success}
                                    </div>
                                )}

                                <form onSubmit={submitBooking}>
                                    {/* Row 1: Name + Email */}
                                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                                        <Field label="Full Name" error={errors.name}>
                                            <input type="text" value={data.name}
                                                onChange={e => setData("name", e.target.value)}
                                                style={inputStyle} placeholder="Your full name"
                                                onFocus={focusStyle} onBlur={blurStyle} required />
                                        </Field>
                                        <Field label="Email Address" error={errors.email}>
                                            <input type="email" value={data.email}
                                                onChange={e => setData("email", e.target.value)}
                                                style={inputStyle} placeholder="your@email.com"
                                                onFocus={focusStyle} onBlur={blurStyle} required />
                                        </Field>
                                    </div>

                                    {/* Row 2: Phone + Service */}
                                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                                        <Field label="Phone Number" error={errors.phone}>
                                            <input type="text" value={data.phone}
                                                onChange={e => setData("phone", e.target.value)}
                                                style={inputStyle} placeholder="+60 12 345 6789"
                                                onFocus={focusStyle} onBlur={blurStyle} required />
                                        </Field>
                                        <Field label="Service Required" error={errors.service_type}>
                                            <select value={data.service_type}
                                                onChange={e => setData("service_type", e.target.value)}
                                                style={{ ...inputStyle, background:"#fff", cursor:"pointer" }}
                                                onFocus={focusStyle} onBlur={blurStyle} required>
                                                <option value="">-- Select a service --</option>
                                                {services.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </Field>
                                    </div>

                                    {/* Row 3: Preferred Date + Consultation Type */}
                                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                                        <Field label="Preferred Date" error={errors.preferred_date}>
                                            <input type="date" value={data.preferred_date}
                                                onChange={e => setData("preferred_date", e.target.value)}
                                                style={inputStyle}
                                                onFocus={focusStyle} onBlur={blurStyle} required />
                                        </Field>
                                        <Field label="Consultation Type" error={errors.consultation_type}>
                                            <div style={{ display:"flex", gap:10, paddingTop:4 }}>
                                                {["online", "in-person"].map(type => (
                                                    <label key={type} style={{
                                                        display:"flex", alignItems:"center", gap:8,
                                                        padding:"9px 16px", borderRadius:10, cursor:"pointer",
                                                        border: `1.5px solid ${data.consultation_type === type ? "#4ade80" : "#e5e7eb"}`,
                                                        background: data.consultation_type === type ? "#f0fdf4" : "#fff",
                                                        transition:"all 0.2s ease", flex:1, justifyContent:"center",
                                                    }}>
                                                        <input type="radio" value={type}
                                                            checked={data.consultation_type === type}
                                                            onChange={() => setData("consultation_type", type)}
                                                            style={{ accentColor:"#15803d" }} />
                                                        <span style={{ fontSize:12, fontWeight:600, color: data.consultation_type === type ? "#065f46" : "#6b7280", textTransform:"capitalize" }}>
                                                            {type}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </Field>
                                    </div>

                                    {/* Row 4: Message */}
                                    <div style={{ marginBottom:24 }}>
                                        <Field label="Additional Message (optional)">
                                            <textarea value={data.message}
                                                onChange={e => setData("message", e.target.value)}
                                                rows={3}
                                                style={{ ...inputStyle, resize:"none" }}
                                                placeholder="Tell us more about your project or requirements..."
                                                onFocus={focusStyle} onBlur={blurStyle} />
                                        </Field>
                                    </div>

                                    <button type="submit" disabled={processing}
                                        className="shimmer-btn"
                                        style={{
                                            width:"100%", background:"linear-gradient(135deg,#064e3b,#065f46)",
                                            color:"#fff", padding:"13px", borderRadius:12,
                                            fontSize:14, fontWeight:700, border:"none", cursor:"pointer",
                                            opacity: processing ? 0.6 : 1,
                                            transition:"all 0.3s ease",
                                        }}>
                                        {processing ? "Submitting..." : "Submit Booking Request →"}
                                    </button>
                                </form>
                            </div>
                        </Reveal>

                        {/* ── RIGHT: SIDEBAR ── */}
                        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                            {/* Check Booking Card */}
                            <Reveal delay={140}>
                                <div style={{
                                    background:"linear-gradient(135deg,#064e3b,#065f46)",
                                    borderRadius:20, padding:24, textAlign:"center",
                                    position:"relative", overflow:"hidden",
                                }}>
                                    {/* Decorative ring */}
                                    <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", border:"1px solid rgba(110,231,183,0.2)", pointerEvents:"none" }} />

                                    <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:22, animation:"floatY 3s ease-in-out infinite" }}>
                                        📋
                                    </div>
                                    <h3 style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:8 }}>
                                        Already have a booking?
                                    </h3>
                                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.6, marginBottom:16 }}>
                                        Check the status of your existing consultation using your reference number.
                                    </p>
                                    <button onClick={openPopup}
                                        className="shimmer-btn"
                                        style={{
                                            width:"100%", background:"#4ade80", color:"#052e16",
                                            padding:"10px", borderRadius:10, fontSize:12, fontWeight:700,
                                            border:"none", cursor:"pointer", transition:"all 0.25s ease",
                                        }}
                                        onMouseEnter={e => e.target.style.background="#86efac"}
                                        onMouseLeave={e => e.target.style.background="#4ade80"}>
                                        Check My Booking →
                                    </button>
                                    <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:12, lineHeight:1.5 }}>
                                        Your reference number was sent to your email after submitting.
                                    </p>
                                </div>
                            </Reveal>

                            {/* Contact Info Card */}
                            <Reveal delay={200}>
                                <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e5e7eb", padding:22 }}>
                                    <p style={{ fontSize:12, fontWeight:700, color:"#064e3b", marginBottom:14, letterSpacing:"0.04em", textTransform:"uppercase" }}>
                                        Contact Info
                                    </p>
                                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                                        {[
                                            { icon:"📍", label:"Address", value:"Sungai Buloh, Selangor" },
                                            { icon:"📞", label:"Phone", value:"+603 1234 5678" },
                                            { icon:"✉️", label:"Email", value:"info@jurukurvisi.com" },
                                            { icon:"🕐", label:"Hours", value:"Mon–Fri, 9am–5pm" },
                                        ].map(({ icon, label, value }) => (
                                            <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                                                <div style={{ width:34, height:34, background:"#f0fdf4", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                                                    {icon}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize:10, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>
                                                    <p style={{ fontSize:12, color:"#374151", fontWeight:600, marginTop:1 }}>{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CHECK BOOKING POPUP ── */}
            {showPopup && (
                <div onClick={e => { if (e.target === e.currentTarget) closePopup(); }}
                    style={{
                        position:"fixed", inset:0, zIndex:9999,
                        background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)",
                        display:"flex", alignItems:"center", justifyContent:"center", padding:20,
                        animation:"lbIn 0.2s ease",
                    }}>
                    <div style={{
                        background:"#fff", borderRadius:20, width:"100%", maxWidth:440,
                        overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.18)",
                        animation:"scIn 0.3s cubic-bezier(.22,1,.36,1)",
                    }}>
                        {/* Popup header */}
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f3f4f6" }}>
                            <p style={{ fontWeight:800, color:"#064e3b", fontSize:14 }}>
                                {searched ? "Booking Status" : "Check Booking Status"}
                            </p>
                            <button onClick={closePopup} style={{
                                width:28, height:28, borderRadius:"50%", border:"none",
                                background:"#f3f4f6", cursor:"pointer", fontSize:12, color:"#6b7280",
                                display:"flex", alignItems:"center", justifyContent:"center",
                            }}>✕</button>
                        </div>

                        {/* Popup body */}
                        <div style={{ padding:"20px" }}>

                            {/* State 1 — Search */}
                            {!searched && (
                                <>
                                    <p style={{ fontSize:12, color:"#6b7280", lineHeight:1.6, marginBottom:16 }}>
                                        Enter your booking reference number below. It was sent to your email when you submitted the form.
                                    </p>
                                    <form onSubmit={checkBooking} style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                        <input type="text" value={refNumber}
                                            onChange={e => setRefNumber(e.target.value)}
                                            style={{ ...inputStyle, fontFamily:"monospace", fontSize:12 }}
                                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                            onFocus={focusStyle} onBlur={blurStyle}
                                            required autoFocus />
                                        <p style={{ fontSize:10, color:"#9ca3af" }}>Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
                                        <button type="submit" disabled={checking || !refNumber.trim()}
                                            style={{
                                                background:"linear-gradient(135deg,#064e3b,#065f46)",
                                                color:"#fff", padding:"11px", borderRadius:10,
                                                fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
                                                opacity: (checking || !refNumber.trim()) ? 0.5 : 1,
                                            }}>
                                            {checking ? "Searching..." : "Check Status →"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* State 2 — Not found */}
                            {searched && !foundBooking && (
                                <div style={{ textAlign:"center", padding:"12px 0" }}>
                                    <div style={{ width:56, height:56, borderRadius:"50%", background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:24 }}>🔍</div>
                                    <h3 style={{ fontWeight:800, color:"#374151", marginBottom:8 }}>Booking Not Found</h3>
                                    <p style={{ fontSize:12, color:"#9ca3af", lineHeight:1.5, marginBottom:20 }}>
                                        No booking found with that reference number. Please double-check the number from your confirmation email.
                                    </p>
                                    <button onClick={() => { setSearched(false); setRefNumber(""); }}
                                        style={{ background:"linear-gradient(135deg,#064e3b,#065f46)", color:"#fff", padding:"10px 24px", borderRadius:10, fontSize:12, fontWeight:700, border:"none", cursor:"pointer" }}>
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* State 3 — Found */}
                            {searched && foundBooking && status && (
                                <>
                                    {/* Status banner */}
                                    <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:12, borderRadius:12, background:status.bg, marginBottom:16 }}>
                                        <div style={{ width:36, height:36, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                                            {status.icon}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight:700, fontSize:13, color:status.color }}>{status.title}</p>
                                            <p style={{ fontSize:11, color:status.color, opacity:0.8, marginTop:2, lineHeight:1.4 }}>{status.desc}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ marginBottom:12 }}>
                                        <DetailRow label="Name"       value={foundBooking.name} />
                                        <DetailRow label="Service"    value={foundBooking.service_type} />
                                        <DetailRow label="Pref. Date" value={foundBooking.preferred_date} />
                                        <DetailRow label="Type"       value={foundBooking.consultation_type} />
                                        <DetailRow label="Reference"  value={foundBooking.reference_number?.slice(0,18) + "..."} />
                                    </div>

                                    {foundBooking.confirmed_date && (
                                        <div style={{ padding:12, borderRadius:12, background:"#f0fdf4", border:"1px solid #bbf7d0", marginBottom:12 }}>
                                            <p style={{ fontSize:10, fontWeight:700, color:"#15803d", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>✓ Confirmed Appointment</p>
                                            <p style={{ fontSize:15, fontWeight:800, color:"#064e3b" }}>{foundBooking.confirmed_date} at {foundBooking.confirmed_time}</p>
                                        </div>
                                    )}

                                    {foundBooking.admin_response && (
                                        <div style={{ padding:12, borderRadius:12, background:"#eff6ff", border:"1px solid #bfdbfe", marginBottom:12 }}>
                                            <p style={{ fontSize:10, fontWeight:700, color:"#1d4ed8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Note from our team</p>
                                            <p style={{ fontSize:11, color:"#1e40af", lineHeight:1.5 }}>{foundBooking.admin_response}</p>
                                        </div>
                                    )}

                                    <button onClick={() => { setSearched(false); setRefNumber(""); setFoundBooking(null); }}
                                        style={{ fontSize:11, color:"#065f46", fontWeight:600, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>
                                        ← Check another booking
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Popup footer */}
                        {searched && foundBooking && (
                            <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                <p style={{ fontSize:10, color:"#9ca3af" }}>Need help? info@jurukurvisi.com</p>
                                <button onClick={closePopup}
                                    style={{ background:"#d1fae5", color:"#065f46", padding:"6px 14px", borderRadius:99, fontSize:11, fontWeight:700, border:"none", cursor:"pointer" }}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}