// Main landing page for Jurukur Visi Sdn Bhd — enhanced with rich animations & interactions.

import PublicLayout from "../Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const services = [
    {
        icon: "📋",
        title: "Consultation Services",
        color: "#d1fae5",
        accent: "#065f46",
    },
    {
        icon: "📐",
        title: "Cadastral Survey",
        color: "#dbeafe",
        accent: "#1e40af",
    },
    {                                
        icon: "🏗️",
        title: "Engineering Survey",
        color: "#fef9c3",
        accent: "#854d0e",
    },
    {
        icon: "🗺️",
        title: "Topographic Survey",
        color: "#ede9fe",
        accent: "#6d28d9",
    },
    {
        icon: "🌊",
        title: "Hydrographic Survey",
        color: "#cffafe",
        accent: "#155e75",
    },
    {
        icon: "📸",
        title: "Photogrammetric Mapping",
        color: "#fce7f3",
        accent: "#9d174d",
    },
    {
        icon: "⚙️",
        title: "Underground Detection & Utilities Mapping",
        color: "#ffedd5",
        accent: "#9a3412",
    },
];

const workImages = [
    "visi1",
    "visi2",
    "visi3",
    "visi4",
    "visi5",
    "visi6",
    "visi7",
    "visi9",
];

const contactInfo = [
    { icon: "📍", label: "Address", value: "Sungai Buloh, Selangor, Malaysia" },
    { icon: "📞", label: "Phone", value: "+03-6038 8523" },
    { icon: "✉️", label: "Email", value: "info@jurukurvisi.com" },
    { icon: "🕐", label: "Hours", value: "Mon–Fri, 9am–5pm" },
];

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
function ParticleCanvas() {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf;
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        const N = 55;
        const dots = Array.from({ length: N }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 0.8,
        }));
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dx = dots[i].x - dots[j].x,
                        dy = dots[i].y - dots[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(110,231,183,${0.15 * (1 - d / 130)})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }
            dots.forEach((d) => {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(110,231,183,0.45)";
                ctx.fill();
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return (
        <canvas
            ref={ref}
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
   TYPEWRITER
───────────────────────────────────────────── */
function Typewriter({ words, speed = 80, pause = 1800 }) {
    const [display, setDisplay] = useState("");
    const [wordIdx, setWordIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[wordIdx];
        let timer;
        if (!deleting && charIdx < word.length) {
            timer = setTimeout(() => setCharIdx((c) => c + 1), speed);
        } else if (!deleting && charIdx === word.length) {
            timer = setTimeout(() => setDeleting(true), pause);
        } else if (deleting && charIdx > 0) {
            timer = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
        } else {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
        }
        setDisplay(word.slice(0, charIdx));
        return () => clearTimeout(timer);
    }, [charIdx, deleting, wordIdx, words, speed, pause]);

    return (
        <span>
            {display}
            <span
                style={{
                    animation: "blink 0.8s step-end infinite",
                    borderRight: "3px solid #4ade80",
                    marginLeft: 2,
                }}
            />
        </span>
    );
}

/* ─────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const dur = 1800,
                    step = 16;
                const inc = target / (dur / step);
                let cur = 0;
                const t = setInterval(() => {
                    cur += inc;
                    if (cur >= target) {
                        setCount(target);
                        clearInterval(t);
                    } else setCount(Math.floor(cur));
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
   SCROLL REVEAL
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom", className = "" }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const ob = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVis(true);
            },
            { threshold: 0.1 },
        );
        if (ref.current) ob.observe(ref.current);
        return () => ob.disconnect();
    }, []);
    const startTransform =
        from === "left"
            ? "translateX(-40px)"
            : from === "right"
              ? "translateX(40px)"
              : "translateY(32px)";
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translate(0)" : startTransform,
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   TILT CARD
───────────────────────────────────────────── */
function TiltCard({ children, className = "", style = {} }) {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hov, setHov] = useState(false);
    const onMove = useCallback((e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setTilt({
            x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -7,
            y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7,
        });
    }, []);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov ? 1.03 : 1})`,
                transition: hov
                    ? "transform 0.1s ease"
                    : "transform 0.55s cubic-bezier(.22,1,.36,1)",
                willChange: "transform",
            }}
            onMouseMove={onMove}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => {
                setTilt({ x: 0, y: 0 });
                setHov(false);
            }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagBtn({ children, href, className = "", style = {} }) {
    const ref = useRef(null);
    const [off, setOff] = useState({ x: 0, y: 0 });
    const onMove = (e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setOff({
            x: (e.clientX - r.left - r.width / 2) * 0.28,
            y: (e.clientY - r.top - r.height / 2) * 0.28,
        });
    };
    const onLeave = () => setOff({ x: 0, y: 0 });
    return (
        <Link
            href={href}
            ref={ref}
            className={className}
            style={{
                ...style,
                display: "inline-block",
                transform: `translate(${off.x}px,${off.y}px)`,
                transition:
                    off.x === 0
                        ? "transform 0.5s cubic-bezier(.22,1,.36,1)"
                        : "transform 0.1s ease",
            }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {children}
        </Link>
    );
}

/* ─────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.88)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                animation: "lbIn 0.25s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    animation: "scIn 0.3s cubic-bezier(.22,1,.36,1)",
                }}
            >
                <img
                    src={src}
                    alt="Work"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "85vh",
                        borderRadius: 16,
                        objectFit: "contain",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                    }}
                />
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: -14,
                        right: -14,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                >
                    ✕
                </button>
                <p
                    style={{
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                        fontSize: 12,
                        marginTop: 10,
                    }}
                >
                    Click outside or press Esc to close
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SCROLL INDICATOR
───────────────────────────────────────────── */
function ScrollIndicator() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                animation: "floatY 2s ease-in-out infinite",
            }}
        >
            <span
                style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                }}
            >
                Scroll
            </span>
            <div
                style={{
                    width: 24,
                    height: 38,
                    borderRadius: 12,
                    border: "2px solid rgba(255,255,255,0.3)",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 6,
                }}
            >
                <div
                    style={{
                        width: 4,
                        height: 8,
                        borderRadius: 2,
                        background: "#4ade80",
                        animation: "scrollDot 1.5s ease-in-out infinite",
                    }}
                />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR — top of page scroll progress
───────────────────────────────────────────── */
function ScrollProgress() {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: 9998,
                background: "rgba(0,0,0,0.1)",
            }}
        >
            <div
                style={{
                    height: "100%",
                    background: "linear-gradient(90deg,#4ade80,#34d399)",
                    width: `${pct}%`,
                    transition: "width 0.1s linear",
                }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Home() {
    const [lightbox, setLightbox] = useState(null);
    const [heroReady, setHeroReady] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const [parallaxY, setParallaxY] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setHeroReady(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Parallax on scroll
    useEffect(() => {
        const onScroll = () => setParallaxY(window.scrollY * 0.35);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Leaflet map
    useEffect(() => {
        let map = null;
        const loadMap = () => {
            const el = document.getElementById("home-map");
            if (!el || el._leaflet_id) return;
            if (typeof window.L !== "undefined") {
                init();
                return;
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
            const sc = document.createElement("script");
            sc.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            sc.onload = init;
            document.head.appendChild(sc);
        };
        function init() {
            const el = document.getElementById("home-map");
            if (!el || el._leaflet_id) return;
            map = window.L.map("home-map").setView([3.1985, 101.5119], 16);
            window.L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: "© OpenStreetMap contributors" },
            ).addTo(map);
            window.L.marker([3.1985, 101.5119])
                .addTo(map)
                .bindPopup(
                    "<b>Jurukur Visi Sdn Bhd</b><br>Sungai Buloh, Selangor",
                )
                .openPopup();
        }
        const t = setTimeout(loadMap, 800);
        return () => {
            clearTimeout(t);
            if (map) map.remove();
        };
    }, []);

    return (
        <PublicLayout>
            <ScrollProgress />

            {/* ── GLOBAL KEYFRAMES ── */}
            <style>{`
                @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes scrollDot   { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(14px)} }
                @keyframes gradShift   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes shimmer     { 0%{left:-60%} 100%{left:120%} }
                @keyframes spinSlow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes pulseRing   { 0%{transform:translate(-50%,-50%) scale(0.8);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
                @keyframes blobMorph   {
                    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    25%     { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    50%     { border-radius: 50% 40% 60% 30% / 40% 70% 50% 60%; }
                    75%     { border-radius: 40% 60% 30% 70% / 60% 30% 60% 40%; }
                }
                @keyframes lbIn { from{opacity:0} to{opacity:1} }
                @keyframes scIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
                @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.4)} 50%{box-shadow:0 0 0 12px rgba(74,222,128,0)} }
                .svc-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
                .svc-card:hover { transform: translateY(-6px) scale(1.02); }
                .gallery-img { transition: transform 0.5s cubic-bezier(.22,1,.36,1); }
                .gallery-item:hover .gallery-img { transform: scale(1.07); }
                .shimmer-btn { position:relative; overflow:hidden; }
                .shimmer-btn::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
                    animation:shimmer 2.8s infinite;
                }
                .stat-card { transition: all 0.35s cubic-bezier(.22,1,.36,1); }
                .stat-card:hover { transform: translateY(-6px) scale(1.04); background: rgba(255,255,255,0.12) !important; }
                .contact-row { transition: all 0.3s ease; }
                .contact-row:hover { transform: translateX(6px); }
            `}</style>

            {/* ══════════════════════════════════════
                1. HERO
            ══════════════════════════════════════ */}
            <section
                className="relative min-h-screen flex flex-col items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(2,44,34,0.88), rgba(6,78,59,0.84)), url(/images/back_img.png)",
                    backgroundSize: "cover",
                    backgroundPosition: `center ${parallaxY}px`,
                    backgroundRepeat: "no-repeat",
                    overflow: "hidden",
                }}
            >
                {/* Animated gradient overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                            "linear-gradient(135deg,rgba(6,95,70,0.3) 0%,transparent 60%,rgba(4,120,87,0.2) 100%)",
                        backgroundSize: "300% 300%",
                        animation: "gradShift 10s ease infinite",
                    }}
                />

                {/* Decorative rings */}
                <div
                    style={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.08)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.14)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -80,
                        left: -80,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.08)",
                        pointerEvents: "none",
                    }}
                />

                <ParticleCanvas />

                {/* Hero content */}
                <div
                    className="max-w-5xl mx-auto px-6 text-center py-20"
                    style={{ position: "relative", zIndex: 1 }}
                >
                    <div
                        style={{
                            opacity: heroReady ? 1 : 0,
                            transform: heroReady
                                ? "translateY(0)"
                                : "translateY(20px)",
                            transition: "all 0.7s ease 0ms",
                        }}
                    >
                        <div className="inline-block bg-green-900 bg-opacity-60 text-green-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                            Bumiputera Surveying Consultancy · Est. 2005
                        </div>
                    </div>

                    <div
                        style={{
                            opacity: heroReady ? 1 : 0,
                            transform: heroReady
                                ? "translateY(0)"
                                : "translateY(28px)",
                            transition: "all 0.7s ease 100ms",
                        }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                            Professional
                            <br />
                            <span
                                style={{
                                    background:
                                        "linear-gradient(90deg,#4ade80,#34d399,#6ee7b7,#4ade80)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundSize: "200%",
                                    animation: "gradShift 3s ease infinite",
                                }}
                            >
                                <Typewriter
                                    words={[
                                        "Surveying & Mapping",
                                        "Cadastral Surveys",
                                        "Engineering Surveys",
                                        "Topographic Mapping",
                                    ]}
                                />
                            </span>
                        </h1>
                    </div>

                    <div
                        style={{
                            opacity: heroReady ? 1 : 0,
                            transform: heroReady
                                ? "translateY(0)"
                                : "translateY(28px)",
                            transition: "all 0.7s ease 200ms",
                        }}
                    >
                        <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                            Jurukur Visi Sdn Bhd delivers precision surveying
                            solutions across Malaysia, trusted by government and
                            private sector clients for over 12 years.
                        </p>
                    </div>

                    <div
                        style={{
                            opacity: heroReady ? 1 : 0,
                            transform: heroReady
                                ? "translateY(0)"
                                : "translateY(28px)",
                            transition: "all 0.7s ease 300ms",
                        }}
                        className="flex flex-wrap gap-4 justify-center mb-16"
                    >
                        <MagBtn
                            href="/projects"
                            className="shimmer-btn bg-white text-green-800 px-8 py-3.5 rounded-full font-semibold hover:bg-green-50 transition text-sm"
                        >
                            View Our Projects
                        </MagBtn>
                        <MagBtn
                            href="/contact"
                            className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-green-800 transition text-sm"
                        >
                            Book Consultation
                        </MagBtn>
                    </div>

                    {/* Stats */}
                    <div
                        style={{
                            opacity: heroReady ? 1 : 0,
                            transform: heroReady
                                ? "translateY(0)"
                                : "translateY(28px)",
                            transition: "all 0.7s ease 420ms",
                        }}
                        className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
                    >
                        {[
                            { label:"Projects Done", value: 100, suffix:"+" },
                            {
                                label: "Years Experience",
                                value: 12,
                                suffix: "+",
                            },
                            {
                                label: "Client Satisfaction",
                                value: 100,
                                suffix: "%",
                            },
                        ].map(({ label, value, suffix }, i) => (
                            <div
                                key={label}
                                className="text-center"
                                style={{ position: "relative" }}
                            >
                                <p className="text-3xl font-bold text-white">
                                    <Counter target={value} suffix={suffix} />
                                </p>
                                <p className="text-green-300 text-xs mt-1">
                                    {label}
                                </p>
                                {/* Pulse ring */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        left: "50%",
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        border: "1.5px solid rgba(74,222,128,0.3)",
                                        animation: `pulseRing ${2 + i * 0.4}s ease-out infinite`,
                                        animationDelay: `${i * 0.5}s`,
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                2. SERVICES
            ══════════════════════════════════════ */}
            <section
                className="py-20 px-6 bg-gray-50"
                style={{ overflow: "hidden" }}
            >
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-12">
                            <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                                What We Do
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-3">
                                Our Services
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                                Comprehensive surveying solutions for every type
                                of project
                            </p>
                        </div>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-5 [&>*:last-child]:col-start-2">
                        {services.map(({ icon, title, color, accent }, i) => (
                            <Reveal
                                key={title}
                                delay={i * 70}
                                from={
                                    i % 3 === 0
                                        ? "left"
                                        : i % 3 === 2
                                          ? "right"
                                          : "bottom"
                                }
                            >
                                <TiltCard
                                    className="svc-card bg-white rounded-2xl p-6 border cursor-pointer"
                                    style={{
                                        borderColor:
                                            hoveredService === i
                                                ? accent
                                                : "#e5e7eb",
                                        background:
                                            hoveredService === i
                                                ? color
                                                : "#fff",
                                    }}
                                >
                                    <div
                                        onMouseEnter={() =>
                                            setHoveredService(i)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredService(null)
                                        }
                                        className="flex items-center gap-4"
                                        style={{ height: "100%" }}
                                    >
                                        <div
                                            style={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: 16,
                                                background:
                                                    hoveredService === i
                                                        ? accent
                                                        : "#f0fdf4",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 24,
                                                flexShrink: 0,
                                                transition:
                                                    "all 0.35s cubic-bezier(.22,1,.36,1)",
                                                animation:
                                                    hoveredService === i
                                                        ? "floatY 1.5s ease-in-out infinite"
                                                        : "none",
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-snug">
                                            {title}
                                        </h3>
                                    </div>
                                </TiltCard>
                            </Reveal>
                        ))}
                    </div>
                    <Reveal delay={200}>
                        <div className="text-center mt-8">
                            <MagBtn
                                href="/about"
                                className="inline-block text-green-700 font-semibold text-sm hover:underline"
                            >
                                Learn more about our services →
                            </MagBtn>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════════════════════
                3. STATS
            ══════════════════════════════════════ */}
            <section
                className="py-20 px-6"
                style={{
                    background:
                        "linear-gradient(135deg,#022c22 0%,#064e3b 50%,#065f46 100%)",
                    backgroundSize: "200% 200%",
                    animation: "gradShift 8s ease infinite",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Blob decorations */}
                <div
                    style={{
                        position: "absolute",
                        top: -80,
                        left: -80,
                        width: 260,
                        height: 260,
                        background: "rgba(74,222,128,0.07)",
                        borderRadius: "50%",
                        animation: "blobMorph 8s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -60,
                        right: -60,
                        width: 200,
                        height: 200,
                        background: "rgba(52,211,153,0.07)",
                        borderRadius: "50%",
                        animation: "blobMorph 10s ease-in-out infinite reverse",
                        pointerEvents: "none",
                    }}
                />

                <div
                    className="max-w-5xl mx-auto"
                    style={{ position: "relative", zIndex: 1 }}
                >
                    <Reveal>
                        <div className="text-center mb-12">
                            <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">
                                By The Numbers
                            </span>
                            <h2 className="text-3xl font-bold text-white mt-3">
                                Our Track Record
                            </h2>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label:"Projects Completed", value: 100, suffix:"+" },
                            {
                                label: "Years Experience",
                                value: 12,
                                suffix: "+",
                            },
                            { label: "Partners", value: 30, suffix: "+" },
                            {
                                label: "Client Satisfaction",
                                value: 100,
                                suffix: "%",
                            },
                        ].map(({ label, value, suffix }, i) => (
                            <Reveal key={label} delay={i * 80}>
                                <div
                                    className="stat-card p-6 rounded-2xl"
                                    style={{
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Shimmer sweep */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background:
                                                "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
                                            animation: `shimmer ${3 + i * 0.5}s infinite`,
                                            animationDelay: `${i * 0.8}s`,
                                            pointerEvents: "none",
                                        }}
                                    />
                                    <p className="text-4xl font-bold text-white mb-1">
                                        <Counter
                                            target={value}
                                            suffix={suffix}
                                        />
                                    </p>
                                    <p className="text-green-300 text-sm">
                                        {label}
                                    </p>
                                    {/* Glow dot */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 10,
                                            right: 10,
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#4ade80",
                                            animation: `glowPulse ${2 + i * 0.3}s ease infinite`,
                                            animationDelay: `${i * 0.4}s`,
                                        }}
                                    />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                4. GALLERY
            ══════════════════════════════════════ */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-12">
                            <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                                Our Work
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-3">
                                Work in the Field
                            </h2>
                            <p className="text-gray-400 mt-2 text-sm">
                                Click any image to view full size
                            </p>
                        </div>
                    </Reveal>
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {workImages.map((img, i) => (
                            <Reveal key={img} delay={i * 55}>
                                <div
                                    className="gallery-item break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative mb-4"
                                    onClick={() =>
                                        setLightbox(`/images/${img}.jpg`)
                                    }
                                    style={{
                                        boxShadow:
                                            "0 4px 16px rgba(0,0,0,0.07)",
                                        transition: "box-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            "0 16px 40px rgba(0,0,0,0.16)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            "0 4px 16px rgba(0,0,0,0.07)")
                                    }
                                >
                                    <img
                                        src={`/images/${img}.jpg`}
                                        alt={`Work ${i + 1}`}
                                        className="gallery-img w-full object-cover"
                                        onError={(e) => {
                                            e.target.parentElement.style.background =
                                                "#e8f5e1";
                                            e.target.parentElement.style.minHeight =
                                                "150px";
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    {/* Hover overlay */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            background: "rgba(6,78,59,0)",
                                            transition: "background 0.35s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "rgba(6,78,59,0.45)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "rgba(6,78,59,0)")
                                        }
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transition duration-300 text-white text-center">
                                            <div
                                                style={{
                                                    fontSize: 28,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                ⤢
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    marginTop: 4,
                                                    letterSpacing: "0.1em",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                View
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                5. CTA BANNER
            ══════════════════════════════════════ */}
            <section
                className="py-20 px-6 text-center"
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                    backgroundSize: "300% 300%",
                    animation: "gradShift 7s ease infinite",
                }}
            >
                {/* Animated blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        width: 500,
                        height: 500,
                        background: "rgba(74,222,128,0.06)",
                        animation: "blobMorph 9s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />
                {/* Rings */}
                <div
                    style={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        border: "1px solid rgba(110,231,183,0.15)",
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
                    className="max-w-2xl mx-auto"
                    style={{ position: "relative", zIndex: 1 }}
                >
                    <Reveal>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to start your project?
                        </h2>
                        <p className="text-green-200 text-sm mb-8 leading-relaxed">
                            Book a consultation with our licensed surveyors
                            today. We cover all states across Malaysia.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <MagBtn
                                href="/contact"
                                className="shimmer-btn bg-white text-green-800 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-green-50 transition"
                            >
                                Book a Consultation →
                            </MagBtn>
                            <MagBtn
                                href="/about"
                                className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white hover:text-green-800 transition"
                            >
                                Learn About Us
                            </MagBtn>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════════════════════
                6. MAP SECTION
            ══════════════════════════════════════ */}
            <section className="px-6 py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-12">
                            <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                                Find Us
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-3">
                                Our Location
                            </h2>
                        </div>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Contact info */}
                        <div className="space-y-4">
                            {contactInfo.map(({ icon, label, value }, i) => (
                                <Reveal key={label} delay={i * 80} from="left">
                                    <div className="contact-row flex gap-4 items-start p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:shadow-sm transition cursor-default">
                                        <div
                                            style={{
                                                width: 44,
                                                height: 44,
                                                background: "#f0fdf4",
                                                borderRadius: 14,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 20,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                                {label}
                                            </p>
                                            <p className="text-gray-700 text-sm mt-0.5 font-medium">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                            <Reveal delay={360} from="left">
                                <MagBtn
                                    href="/contact"
                                    className="shimmer-btn block w-full text-center bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition mt-2"
                                >
                                    Book a Consultation →
                                </MagBtn>
                            </Reveal>
                        </div>

                        {/* Map */}
                        <Reveal delay={100} className="md:col-span-2">
                            <div
                                id="home-map"
                                className="rounded-2xl overflow-hidden border border-gray-100"
                                style={{
                                    height: 380,
                                    zIndex: 1,
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                                }}
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
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
                                ["Staff Login", "/login"],
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
                            <p>📞 +03-6038 85238</p>
                            <p>✉️ info@jurukurvisi.com</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-3">Find Us</p>
                        <div className="space-y-2 text-sm">
                            <a
                                href="https://www.facebook.com/jurukurvisi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-blue-400 transition"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Jurukur Visi Sdn Bhd
                            </a>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-xs">
                    © {new Date().getFullYear()} Jurukur Visi Sdn Bhd. All
                    rights reserved.
                </div>
            </footer>

            {lightbox && (
                <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
            )}
        </PublicLayout>
    );
}
