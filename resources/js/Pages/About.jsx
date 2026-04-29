// The About component renders the "About Us" page for Jurukur Visi, showcasing the company's mission, services, team, equipment, collaborations and certifications.

import PublicLayout from "../Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   COUNTER — animated number count-up
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const duration = 1800;
                const step = 16;
                const increment = target / (duration / step);
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        setCount(target);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, step);
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

/* ─────────────────────────────────────────────
   SECTION TITLE
───────────────────────────────────────────── */
function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <p className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                {children}
            </p>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
    );
}

/* ─────────────────────────────────────────────
   REVEAL ON SCROLL — wraps children with fade-in + slide-up
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.12 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(32px)",
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   TILT CARD — 3D tilt on mouse move
───────────────────────────────────────────── */
function TiltCard({ children, className = "", style = {} }) {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ x: dy * -8, y: dx * 8 });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
                transition: hovered
                    ? "transform 0.1s ease"
                    : "transform 0.5s cubic-bezier(.22,1,.36,1)",
                willChange: "transform",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   PARTICLE CANVAS — floating dots & lines for hero
───────────────────────────────────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const DOTS = 48;
        const dots = Array.from({ length: DOTS }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // lines between nearby dots
            for (let i = 0; i < DOTS; i++) {
                for (let j = i + 1; j < DOTS; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(110,231,183,${0.18 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }

            // dots
            dots.forEach((d) => {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(110,231,183,0.5)";
                ctx.fill();

                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON — cursor attraction effect
───────────────────────────────────────────── */
function MagneticBtn({ children, href, className = "" }) {
    const ref = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setOffset({
            x: (e.clientX - cx) * 0.3,
            y: (e.clientY - cy) * 0.3,
        });
    };

    const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

    return (
        <Link
            href={href}
            ref={ref}
            className={className}
            style={{
                display: "inline-block",
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition:
                    offset.x === 0
                        ? "transform 0.5s cubic-bezier(.22,1,.36,1)"
                        : "transform 0.1s ease",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </Link>
    );
}

/* ─────────────────────────────────────────────
   PULSE RING — animated ring for stat numbers
───────────────────────────────────────────── */
function PulseRing() {
    return (
        <span
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid rgba(74,222,128,0.3)",
                animation: "pulseRing 2s ease-out infinite",
                pointerEvents: "none",
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const services = [
    {
        icon: "📋",
        title: "Consultation Services",
        desc: "Advisory services for land development processes including land conversion, land surrender and re-alienation, subdivision, amalgamation and preparation of land and survey-related documents.",
    },
    {
        icon: "📐",
        title: "Cadastral Survey",
        desc: "Carrying out cadastral survey works including subdivision, amalgamation, land title surveys, Strata Title surveys and First Alienation of government land across all property types.",
    },
    {
        icon: "🏗️",
        title: "Engineering Survey",
        desc: "Detailed surveying using tacheometry, cross-sections, longitudinal sections and strip surveys. Includes setting out works for roads, buildings, grid pegging and leveling.",
    },
    {
        icon: "🗺️",
        title: "Topographic Survey",
        desc: "Measurement of all natural and man-made features plotted at various scales for development purposes including new townships, industrial areas, golf courses and other developments.",
    },
    {
        icon: "🌊",
        title: "Hydrographic Survey",
        desc: "Determining water depth and tidal levels for port traffic studies, coastal erosion planning and land reclamation. Services include Bathymetric Surveys, Tidal Observation and Wave Measurement.",
    },
    {
        icon: "📸",
        title: "Photogrammetric Mapping",
        desc: "Small-scale mapping works for agricultural development and reservoir sites including Aerial Photography, Digital Orthophoto, Photogrammetric Line Mapping, Mosaics and Airborne Laser Scanning.",
    },
    {
        icon: "⚙️",
        title: "Underground Detection & Utilities Mapping",
        desc: "Locating and mapping objects beneath the ground surface including underground cables, water and gas pipes, and determining the vertical and horizontal position of embedded structures within buildings.",
    },
];

const equipment = [
    {
        img: "/images/visi7.jpg",
        name: "Total Station",
        desc: "Electronic theodolite for angle & distance measurement",
    },
    {
        img: "/images/visi8.jpg",
        name: "GNSS Receiver",
        desc: "High-precision GPS positioning equipment",
    },
    {
        img: "/images/visi9.jpg",
        name: "Drone / UAV",
        desc: "Aerial mapping and photogrammetry surveys",
    },
    {
        img: "/images/visi10.jpg",
        name: "GPR Equipment",
        desc: "Ground penetrating radar for utility detection",
    },
];

const collaborations = [
    {
        abbr: "JKR",
        name: "Jabatan Kerja Raya",
        type: "Government Agency",
        bg: "#dbeafe",
        color: "#1e40af",
    },
    {
        abbr: "PTG",
        name: "Pejabat Tanah & Galian",
        type: "Land Office",
        bg: "#d1fae5",
        color: "#065f46",
    },
    {
        abbr: "PLN",
        name: "Placeholder Developer",
        type: "Private Developer",
        bg: "#fef9c3",
        color: "#854d0e",
    },
    {
        abbr: "ENG",
        name: "Placeholder Engineering",
        type: "Engineering Firm",
        bg: "#ede9fe",
        color: "#6d28d9",
    },
];

const certifications = [
    {
        icon: "📋",
        title: "SSM Registered",
        sub: "Suruhanjaya Syarikat Malaysia",
        bg: "#dbeafe",
        color: "#1e40af",
    },
    {
        icon: "⭐",
        title: "Bumiputera Certified",
        sub: "Lembaga Jurukur Tanah Malaysia (LJTM)",
        bg: "#fef9c3",
        color: "#854d0e",
    },
    {
        icon: "🏢",
        title: "MOF Registered",
        sub: "Ministry of Finance Malaysia",
        bg: "#f3e8ff",
        color: "#6d28d9",
    },
];

const teamMembers = [
    {
        name: "Zainal Abidin Bin Kamaruddin",
        role: "Director & Licensed Surveyor",
        exp: "19+ years experience",
    },
    {
        name: "Faizah Binti Abdul Wahab",
        role: "Account & Finance Manager",
        exp: "10+ years experience",
    },
    {
        name: "Azharudin Bin Abu Hassan",
        role: "Project Manager",
        exp: "12+ years experience",
    },
    {
        name: "Muhammad Fuad bin Yusof",
        role: "Senior Surveyor",
        exp: "11+ years experience",
    },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function About({ stats }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [caption, setCaption] = useState("");
    const [activeService, setActiveService] = useState(null);
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        // Trigger hero entrance after mount
        const t = setTimeout(() => setHeroLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const handleImageClick = (src, alt) => {
        setSelectedImg(src);
        setCaption(alt);
        setModalOpen(true);
    };

    return (
        <PublicLayout>
            {/* ── GLOBAL KEYFRAMES ── */}
            <style>{`
                @keyframes pulseRing {
                    0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 1; }
                    100% { transform: translate(-50%,-50%) scale(2);   opacity: 0; }
                }
                @keyframes floatY {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-10px); }
                }
                @keyframes gradientShift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes shimmer {
                    0%   { left: -60%; }
                    100% { left: 120%; }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .service-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
                .service-card:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 20px 40px rgba(6,95,70,0.12); }
                .team-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
                .team-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(6,95,70,0.14); }
                .collab-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
                .collab-card:hover { transform: translateY(-4px) scale(1.02); }
                .cert-card { transition: all 0.4s cubic-bezier(.22,1,.36,1); }
                .cert-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
                .hero-img { transition: transform 0.6s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
                .hero-img:hover { transform: scale(1.06) rotate(-1deg) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.35); }
                .shimmer-btn { position: relative; overflow: hidden; }
                .shimmer-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -60%; width: 40%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    animation: shimmer 2.5s infinite;
                }
            `}</style>

            {/* ── HERO ── */}
            <section
                className="px-6 py-14"
                style={{
                    background:
                        "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #047857 100%)",
                    backgroundSize: "300% 300%",
                    animation: "gradientShift 8s ease infinite",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative rings */}
                <div
                    style={{
                        position: "absolute",
                        top: -80,
                        right: -80,
                        width: 320,
                        height: 320,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.12)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: -40,
                        right: -40,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.18)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -60,
                        left: -60,
                        width: 240,
                        height: 240,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.1)",
                        pointerEvents: "none",
                    }}
                />

                <ParticleCanvas />

                <div
                    className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
                    style={{ position: "relative", zIndex: 1 }}
                >
                    {/* Left text */}
                    <div>
                        <div
                            style={{
                                opacity: heroLoaded ? 1 : 0,
                                transform: heroLoaded
                                    ? "translateY(0)"
                                    : "translateY(24px)",
                                transition:
                                    "all 0.7s cubic-bezier(.22,1,.36,1) 0ms",
                            }}
                        >
                            <span className="inline-block text-xs font-bold text-green-300 uppercase tracking-widest bg-green-900 bg-opacity-50 px-3 py-1 rounded-full mb-4">
                                Est. 2005 · Sungai Buloh, Selangor
                            </span>
                        </div>
                        <div
                            style={{
                                opacity: heroLoaded ? 1 : 0,
                                transform: heroLoaded
                                    ? "translateY(0)"
                                    : "translateY(32px)",
                                transition:
                                    "all 0.7s cubic-bezier(.22,1,.36,1) 120ms",
                            }}
                        >
                            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                                About
                                <br />
                                <span
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #4ade80, #34d399, #6ee7b7)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundSize: "200%",
                                        animation:
                                            "gradientShift 3s ease infinite",
                                    }}
                                >
                                    Jurukur Visi
                                </span>
                                <br />
                                Sdn Bhd
                            </h1>
                        </div>
                        <div
                            style={{
                                opacity: heroLoaded ? 1 : 0,
                                transform: heroLoaded
                                    ? "translateY(0)"
                                    : "translateY(32px)",
                                transition:
                                    "all 0.7s cubic-bezier(.22,1,.36,1) 220ms",
                            }}
                        >
                            <p className="text-green-100 text-sm leading-relaxed mb-8">
                                A licensed Bumiputera-owned surveying and
                                mapping consultancy delivering precision
                                solutions across Malaysia for over 12 years.
                            </p>
                            <MagneticBtn
                                href="/contact"
                                className="shimmer-btn inline-block bg-green-400 text-green-950 px-7 py-3 rounded-full font-bold text-sm hover:bg-green-300 transition duration-300"
                            >
                                Book a Consultation →
                            </MagneticBtn>
                        </div>
                    </div>

                    {/* Right image grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            "/images/visi1.jpg",
                            "/images/visi2.jpg",
                            "/images/visi3.jpg",
                            "/images/visi4.jpg",
                        ].map((src, i) => (
                            <div
                                key={src}
                                className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? "mt-4" : ""}`}
                                style={{
                                    opacity: heroLoaded ? 1 : 0,
                                    transform: heroLoaded
                                        ? "scale(1)"
                                        : "scale(0.9)",
                                    transition: `all 0.7s cubic-bezier(.22,1,.36,1) ${300 + i * 80}ms`,
                                    animation: `floatY ${4 + i * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`Survey work ${i + 1}`}
                                    className="hero-img w-full h-32 object-cover cursor-pointer"
                                    onClick={() =>
                                        handleImageClick(
                                            src,
                                            `Survey work ${i + 1}`,
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section
                style={{
                    background: "#053d30",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Animated scan line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.04) 50%, transparent 100%)",
                        animation: "shimmer 4s linear infinite",
                        pointerEvents: "none",
                    }}
                />
                <div className="max-w-6xl mx-auto grid grid-cols-4">
                    {[
                        { num: 100, suffix: "+", label: "Projects Done" },
                        { num: 12, suffix: "+", label: "Years Experience" },
                        { num: 10, suffix: "+", label: "Licensed Surveyors" },
                        { num: 100, suffix: "%", label: "Client Satisfaction" },
                    ].map(({ num, suffix, label }, i) => (
                        <div
                            key={label}
                            className="py-6 text-center"
                            style={{
                                borderRight:
                                    i < 3
                                        ? "0.5px solid rgba(255,255,255,0.1)"
                                        : "none",
                                position: "relative",
                            }}
                        >
                            {/* Pulse ring behind number */}
                            <div
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <p
                                    className="text-2xl font-bold"
                                    style={{ color: "#4ade80" }}
                                >
                                    <Counter target={num} suffix={suffix} />
                                </p>
                                <PulseRing />
                            </div>
                            <p
                                className="text-xs uppercase tracking-wide mt-1"
                                style={{ color: "#6ee7b7" }}
                            >
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-white">
                <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">
                    {/* ── MISSION & VISION ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>Mission & Vision</SectionTitle>
                        </Reveal>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Reveal delay={0}>
                                <TiltCard
                                    className="rounded-2xl p-7 h-full"
                                    style={{
                                        background: "#f0fdf4",
                                        border: "0.5px solid #bbf7d0",
                                    }}
                                >
                                    <div
                                        className="text-3xl mb-3"
                                        style={{
                                            animation:
                                                "floatY 3s ease-in-out infinite",
                                        }}
                                    >
                                        🎯
                                    </div>
                                    <h3 className="font-bold text-green-900 mb-3">
                                        Our Mission
                                    </h3>
                                    <p className="text-sm text-green-800 leading-relaxed">
                                        To deliver precise, reliable and
                                        professional surveying and mapping
                                        services that support sustainable
                                        infrastructure development and land
                                        management across Malaysia.
                                    </p>
                                </TiltCard>
                            </Reveal>
                            <Reveal delay={120}>
                                <TiltCard
                                    className="rounded-2xl p-7 h-full"
                                    style={{
                                        background: "#eff6ff",
                                        border: "0.5px solid #bfdbfe",
                                    }}
                                >
                                    <div
                                        className="text-3xl mb-3"
                                        style={{
                                            animation:
                                                "floatY 3.5s ease-in-out infinite",
                                            animationDelay: "0.5s",
                                        }}
                                    >
                                        🔭
                                    </div>
                                    <h3 className="font-bold text-blue-900 mb-3">
                                        Our Vision
                                    </h3>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        To be the most trusted and innovative
                                        Bumiputera surveying consultancy in
                                        Malaysia, recognised for technical
                                        excellence, integrity and commitment to
                                        client success.
                                    </p>
                                </TiltCard>
                            </Reveal>
                        </div>
                    </div>

                    {/* ── COMPANY PROFILE ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>Company Profile</SectionTitle>
                        </Reveal>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <Reveal delay={0}>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        "/images/visi5.jpg",
                                        "/images/visi6.jpg",
                                    ].map((src, i) => (
                                        <div
                                            key={src}
                                            className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? "mt-6" : ""}`}
                                            style={{
                                                animation: `floatY ${4 + i}s ease-in-out infinite`,
                                                animationDelay: `${i * 0.6}s`,
                                            }}
                                        >
                                            <img
                                                src={src}
                                                alt={`Company ${i + 1}`}
                                                className="hero-img w-full h-44 object-cover"
                                                onError={(e) => {
                                                    e.target.parentElement.style.background =
                                                        "#d1fae5";
                                                    e.target.parentElement.style.minHeight =
                                                        "176px";
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                            <Reveal delay={160}>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                                    Who We Are
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
                                    Malaysia's Trusted
                                    <br />
                                    Surveying Partner
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    Jurukur Visi Sdn Bhd is a professional
                                    Bumiputera-owned consulting firm based in
                                    Sungai Buloh, Selangor. Since 2005, we have
                                    served government and private sector clients
                                    nationwide with precision and
                                    professionalism on every engagement.
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Our licensed surveyors bring deep local
                                    expertise and state-of-the-art equipment to
                                    every project — from small boundary surveys
                                    to large-scale infrastructure mapping.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        {
                                            label: "✓ SSM Registered",
                                            bg: "#dbeafe",
                                            color: "#1e40af",
                                        },
                                        {
                                            label: "✓ Bumiputera Certified",
                                            bg: "#fef9c3",
                                            color: "#854d0e",
                                        },
                                    ].map(({ label, bg, color }) => (
                                        <span
                                            key={label}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                            style={{ background: bg, color }}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    {/* ── SERVICES ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>Our Services</SectionTitle>
                        </Reveal>
                        <div className="grid grid-cols-2 gap-5">
                            {services.map(({ icon, title, desc }, index) => (
                                <Reveal key={title} delay={index * 60}>
                                    <div
                                        className="service-card relative rounded-2xl border p-6 cursor-pointer"
                                        style={{
                                            borderColor:
                                                activeService === index
                                                    ? "#4ade80"
                                                    : "#e5e7eb",
                                            background:
                                                activeService === index
                                                    ? "#f0fdf4"
                                                    : "#fff",
                                        }}
                                        onMouseEnter={() =>
                                            setActiveService(index)
                                        }
                                        onMouseLeave={() =>
                                            setActiveService(null)
                                        }
                                    >
                                        {/* Top accent bar */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                            style={{
                                                background:
                                                    activeService === index
                                                        ? "linear-gradient(90deg, #4ade80, #34d399)"
                                                        : "#15803d",
                                                transition: "background 0.3s",
                                            }}
                                        />
                                        {/* Background number */}
                                        <span
                                            className="absolute top-3 right-4 font-bold select-none"
                                            style={{
                                                fontSize: "42px",
                                                color:
                                                    activeService === index
                                                        ? "#bbf7d0"
                                                        : "#E5E7EB",
                                                lineHeight: 1,
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div
                                            className="text-3xl mb-3 mt-1"
                                            style={{
                                                animation:
                                                    activeService === index
                                                        ? "floatY 1.5s ease-in-out infinite"
                                                        : "none",
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2">
                                            {title}
                                        </h3>
                                        <p
                                            className={`text-gray-500 text-sm leading-relaxed ${index === 6 ? "max-w-3xl" : ""}`}
                                        >
                                            {desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* ── TEAM ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>Meet Our Team</SectionTitle>
                        </Reveal>
                        <Reveal delay={60}>
                            <p className="text-gray-500 text-sm mb-6">
                                Our licensed surveyors and specialists bring
                                decades of combined experience.
                            </p>
                        </Reveal>
                        <div className="grid md:grid-cols-4 gap-6">
                            {teamMembers.map(({ name, role, exp }, i) => {
                                const parts = name.trim().split(" ");
                                const initials = (
                                    parts[0][0] + parts[parts.length - 1][0]
                                ).toUpperCase();
                                return (
                                    <Reveal key={name} delay={i * 80}>
                                        <div className="team-card group rounded-2xl border border-gray-100 p-6 text-center bg-white">
                                            {/* Avatar with ring animation on hover */}
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: 64,
                                                    height: 64,
                                                    margin: "0 auto 16px",
                                                }}
                                            >
                                                <div
                                                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-700"
                                                    style={{
                                                        transition:
                                                            "all 0.35s cubic-bezier(.22,1,.36,1)",
                                                        position: "relative",
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    {initials}
                                                </div>
                                                {/* Spinning ring */}
                                                <div
                                                    className="group-hover:opacity-100"
                                                    style={{
                                                        opacity: 0,
                                                        position: "absolute",
                                                        inset: -4,
                                                        borderRadius: "50%",
                                                        border: "2px dashed #4ade80",
                                                        animation:
                                                            "spinSlow 4s linear infinite",
                                                        transition:
                                                            "opacity 0.3s",
                                                    }}
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm">
                                                {name}
                                            </h3>
                                            <p className="text-green-600 text-xs mt-1 font-medium">
                                                {role}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {exp}
                                            </p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── EQUIPMENT ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>Our Equipment</SectionTitle>
                        </Reveal>
                        <div className="grid md:grid-cols-4 gap-5">
                            {equipment.map(({ img, name, desc }, i) => (
                                <Reveal key={name} delay={i * 80}>
                                    <TiltCard className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300 cursor-pointer">
                                        <div style={{ overflow: "hidden" }}>
                                            <img
                                                src={img}
                                                alt={name}
                                                className="w-full h-36 object-cover"
                                                style={{
                                                    transition:
                                                        "transform 0.5s cubic-bezier(.22,1,.36,1)",
                                                }}
                                                onError={(e) => {
                                                    e.target.parentElement.style.background =
                                                        "#f0fdf4";
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform =
                                                        "scale(1.1)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform =
                                                        "scale(1)";
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="font-bold text-gray-800 text-sm">
                                                {name}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                                {desc}
                                            </p>
                                        </div>
                                    </TiltCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* ── COLLABORATIONS ── */}
                    <div>
                        <Reveal>
                            <SectionTitle>
                                Clients
                            </SectionTitle>
                        </Reveal>
                        <div className="grid md:grid-cols-4 gap-5">
                            {collaborations.map(
                                ({ abbr, name, type, bg, color }, i) => (
                                    <Reveal key={name} delay={i * 70}>
                                        <div className="collab-card rounded-2xl border border-gray-100 p-6 text-center">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                                                style={{
                                                    background: bg,
                                                    color,
                                                    // animation: `floatY ${3 + i * 0.3}s ease-in-out infinite`, //flaoting animation
                                                    animationDelay: `${i * 0.3}s`,
                                                }}
                                            >
                                                {abbr}
                                            </div>
                                            <p className="font-bold text-gray-800 text-sm">
                                                {name}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {type}
                                            </p>
                                        </div>
                                    </Reveal>
                                ),
                            )}
                        </div>
                    </div>

                    {/* ── CERTIFICATIONS ── */}
                    {/* <div>
                        <Reveal>
                            <SectionTitle>
                                Certifications & Accreditations
                            </SectionTitle>
                        </Reveal>
                        <div className="grid md:grid-cols-3 gap-5">
                            {certifications.map(
                                ({ icon, title, sub, bg, color }, i) => (
                                    <Reveal key={title} delay={i * 100}>
                                        <div className="cert-card rounded-2xl border border-gray-100 p-6 text-center">
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                                                style={{
                                                    background: bg,
                                                    animation: `floatY ${3 + i * 0.4}s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.5}s`,
                                                }}
                                            >
                                                {icon}
                                            </div>
                                            <p className="font-bold text-gray-800 text-sm">
                                                {title}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                                {sub}
                                            </p>
                                        </div>
                                    </Reveal>
                                ),
                            )}
                        </div>
                    </div> */}

                    {/* ── CTA ── */}
                    <Reveal>
                        <div
                            className="rounded-2xl p-10 text-center"
                            style={{
                                background:
                                    "linear-gradient(135deg, #064e3b, #065f46)",
                                backgroundSize: "200% 200%",
                                animation: "gradientShift 5s ease infinite",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Decorative circles */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: -40,
                                    right: -40,
                                    width: 160,
                                    height: 160,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(110,231,183,0.2)",
                                    pointerEvents: "none",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -30,
                                    left: -30,
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(110,231,183,0.15)",
                                    pointerEvents: "none",
                                }}
                            />

                            <h2
                                className="text-2xl font-bold text-white mb-3"
                                style={{ position: "relative" }}
                            >
                                Ready to start your project?
                            </h2>
                            <p
                                className="text-green-200 text-sm mb-6"
                                style={{ position: "relative" }}
                            >
                                Book a consultation with our team and get a
                                project quote.
                            </p>
                            <MagneticBtn
                                href="/contact"
                                className="shimmer-btn inline-block bg-white text-green-800 px-8 py-3 rounded-full font-bold text-sm hover:bg-green-50 transition duration-300"
                            >
                                Book a Consultation →
                            </MagneticBtn>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div>
                        <p className="text-white font-bold text-lg mb-2">
                            JURUKUR VISI
                        </p>
                        <p className="text-sm leading-relaxed">
                            Professional Bumiputera surveying and mapping
                            consultancy based in Selangor, Malaysia.
                        </p>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-3">
                            Quick Links
                        </p>
                        <div className="space-y-2 text-sm">
                            {[
                                ["Home", "/"],
                                ["About", "/about"],
                                ["Projects", "/projects"],
                                ["Contact", "/contact"],
                            ].map(([label, href]) => (
                                <div key={label}>
                                    <Link
                                        href={href}
                                        className="hover:text-green-400 transition"
                                    >
                                        {label}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-3">Contact</p>
                        <div className="space-y-2 text-sm">
                            <p>📍 Sungai Buloh, Selangor</p>
                            <p>📞 +603 1234 5678</p>
                            <p>✉️ info@jurukurvisi.com</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-xs">
                    © {new Date().getFullYear()} Jurukur Visi Sdn Bhd. All
                    rights reserved.
                </div>
            </footer>

            {/* ── IMAGE MODAL ── */}
            {modalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(8px)",
                        animation: "fadeIn 0.2s ease",
                    }}
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        style={{
                            maxWidth: 520,
                            animation: "scaleIn 0.3s cubic-bezier(.22,1,.36,1)",
                        }}
                    >
                        <img
                            src={selectedImg}
                            className="rounded-2xl w-full shadow-2xl"
                            alt={caption}
                        />
                        <p className="text-white text-sm mt-3 text-center opacity-70">
                            {caption}
                        </p>
                        <p className="text-green-400 text-xs text-center mt-1">
                            Click anywhere to close
                        </p>
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                    `}</style>
                </div>
            )}
        </PublicLayout>
    );
}
