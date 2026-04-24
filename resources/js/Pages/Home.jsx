import PublicLayout from "../Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

const services = [
    {
        title: "Cadastral Survey",
        desc: "Precise boundary surveys for land ownership and title registration.",
        icon: "📐",
    },
    {
        title: "Topographic Mapping",
        desc: "Detailed mapping of terrain features for planning and development.",
        icon: "🗺️",
    },
    {
        title: "Engineering Survey",
        desc: "Construction and infrastructure surveys for engineering projects.",
        icon: "🏗️",
    },
    {
        title: "Strata Title",
        desc: "Strata title surveys for multi-storey buildings and developments.",
        icon: "🏢",
    },
    {
        title: "GPS Survey",
        desc: "High-precision GPS positioning for large-scale mapping projects.",
        icon: "📡",
    },
    {
        title: "Underground Utilities",
        desc: "Detection and mapping of underground utility networks.",
        icon: "⚙️",
    },
];

const team = [
    {
        name: "Zainal Abidin Bin Kamaruddin",
        role: "Director & Licensed Surveyor",
        exp: "25+ years experience",
    },
    {
        name: "Faizah Binti Abdul Wahab",
        role: "Account & Finance Manager",
        exp: "10+ years experience",
    },
    {
        name: "Fatin Binti Nor Anuar",
        role: "Administrative Officer",
        exp: "8+ years experience",
    },
    {
        name: "Azharudin Bin Abu Hassan",
        role: "Project Manager",
        exp: "6+ years experience",
    },
];

const skills = [
    { label: "Cadastral Surveying", value: 95 },
    { label: "Topographic Mapping", value: 90 },
    { label: "GIS & Geospatial", value: 85 },
    { label: "Engineering Survey", value: 88 },
    { label: "GPS Technology", value: 92 },
    { label: "AutoCAD / Civil 3D", value: 80 },
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

// Lightbox component
function Lightbox({ src, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                }}
            >
                <img
                    src={src}
                    alt="Work"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "85vh",
                        borderRadius: "12px",
                        objectFit: "contain",
                    }}
                />
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "-14px",
                        right: "-14px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

// Animated counter
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) {
                        setCount(target);
                        clearInterval(timer);
                    } else setCount(start);
                }, 25);
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

// Skill bar
function SkillBar({ label, value }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => setWidth(value), 200);
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref} className="mb-5">
            <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>
                <span className="text-sm text-green-700 font-medium">
                    {value}%
                </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    style={{
                        width: `${width}%`,
                        transition: "width 1.2s ease-in-out",
                    }}
                    className="h-full bg-green-600 rounded-full"
                />
            </div>
        </div>
    );
}

export default function Home({ stats }) {
    const [lightbox, setLightbox] = useState(null);

    return (
        <PublicLayout>
            {/* ── 1. HERO ── */}
            <section
                className="relative min-h-screen flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6, 78, 59, 0.82), rgba(4, 120, 87, 0.82)), url(/images/back_img.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    overflow: "hidden",
                }}
            >
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10 py-32">
                    <div className="inline-block bg-green-800 bg-opacity-60 text-green-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                        Bumiputera Surveying Consultancy · Est. 2005
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Professional
                        <br />
                        <span className="text-green-300">
                            Surveying & Mapping
                        </span>
                    </h1>
                    <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Jurukur Visi Sdn Bhd delivers precision surveying
                        solutions across Malaysia. Trusted by government and
                        private sector clients for over 12 years.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/projects"
                            className="bg-white text-green-800 px-8 py-3.5 rounded-full font-semibold hover:bg-green-50 transition text-sm"
                        >
                            View Our Projects
                        </Link>
                        <Link
                            href="/contact"
                            className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-green-800 transition text-sm"
                        >
                            Book Consultation
                        </Link>
                    </div>

                    {/* Quick stats under hero */}
                    <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
                        {[
                            {
                                label: "Projects Done",
                                value: stats?.projects ?? 0,
                                suffix: "+",
                            },
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
                        ].map(({ label, value, suffix }) => (
                            <div key={label} className="text-center">
                                <p className="text-3xl font-bold text-white">
                                    <Counter target={value} suffix={suffix} />
                                </p>
                                <p className="text-green-300 text-xs mt-1">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 2. PROMO / ABOUT ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Who We Are
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
                            Malaysia's Trusted
                            <br />
                            Surveying Partner
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-5">
                            Based in Sungai Buloh, Selangor, Jurukur Visi Sdn
                            Bhd is a licensed Bumiputera-owned consulting firm
                            specialising in advanced mapping and surveying
                            solutions.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            We support infrastructure development, land
                            management and geospatial projects across all states
                            in Malaysia, delivering precision and
                            professionalism on every engagement.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Licensed by JUPEM", icon: "✓" },
                                { label: "Bumiputera Certified", icon: "✓" },
                                { label: "ISO Compliant", icon: "✓" },
                                { label: "Nationwide Coverage", icon: "✓" },
                            ].map(({ label, icon }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                    <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {icon}
                                    </span>
                                    {label}
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/contact"
                            className="inline-block mt-8 bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition"
                        >
                            Get In Touch →
                        </Link>
                    </div>

                    {/* Right side image grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <img
                            src="/images/visi1.jpg"
                            alt="Survey work"
                            className="rounded-2xl object-cover w-full h-48 hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => setLightbox("/images/visi1.jpg")}
                            onError={(e) => {
                                e.target.style.background = "#e8f5e1";
                                e.target.style.minHeight = "192px";
                            }}
                        />
                        <img
                            src="/images/visi2.jpg"
                            alt="Survey work"
                            className="rounded-2xl object-cover w-full h-48 mt-6 hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => setLightbox("/images/visi2.jpg")}
                            onError={(e) => {
                                e.target.style.background = "#e8f5e1";
                                e.target.style.minHeight = "192px";
                            }}
                        />
                        <img
                            src="/images/visi3.jpg"
                            alt="Survey work"
                            className="rounded-2xl object-cover w-full h-48 hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => setLightbox("/images/visi3.jpg")}
                            onError={(e) => {
                                e.target.style.background = "#e8f5e1";
                                e.target.style.minHeight = "192px";
                            }}
                        />
                        <img
                            src="/images/visi4.jpg"
                            alt="Survey work"
                            className="rounded-2xl object-cover w-full h-48 mt-6 hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => setLightbox("/images/visi4.jpg")}
                            onError={(e) => {
                                e.target.style.background = "#e8f5e1";
                                e.target.style.minHeight = "192px";
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ── 3. SERVICES ── */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            What We Do
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Our Services
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                            Comprehensive surveying and mapping solutions
                            tailored to your project needs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map(({ title, desc, icon }) => (
                            <div
                                key={title}
                                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-green-200 hover:shadow-md transition duration-300 group"
                            >
                                <div className="text-3xl mb-4">{icon}</div>
                                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-700 transition">
                                    {title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. STATISTICS ── */}
            <section className="py-24 px-6 bg-green-800 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">
                            By The Numbers
                        </span>
                        <h2 className="text-4xl font-bold mt-3">
                            Our Track Record
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            {
                                label: "Projects Completed",
                                value: stats?.projects ?? 50,
                                suffix: "+",
                            },
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
                        ].map(({ label, value, suffix }) => (
                            <div
                                key={label}
                                className="p-6 rounded-2xl bg-green-700 bg-opacity-40"
                            >
                                <p className="text-4xl font-bold text-white mb-1">
                                    <Counter target={value} suffix={suffix} />
                                </p>
                                <p className="text-green-300 text-sm">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. TEAM ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            The People
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Meet Our Team
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                            Our licensed surveyors and specialists bring decades
                            of combined experience.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {team.map(({ name, role, exp }) => {
                            const parts = name.trim().split(" ");
                            const initials = (
                                parts[0][0] +
                                (parts.length > 1
                                    ? parts[parts.length - 1][0]
                                    : "")
                            ).toUpperCase();
                            return (
                                <div key={name} className="text-center group">
                                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-700 group-hover:bg-green-700 group-hover:text-white transition duration-300">
                                        {initials}
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
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 6. WORK GALLERY ── */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Our Work
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Work in the Field
                        </h2>
                        <p className="text-gray-500 mt-4">
                            Click any image to view full size.
                        </p>
                    </div>
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {workImages.map((img, i) => (
                            <div
                                key={img}
                                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
                                onClick={() =>
                                    setLightbox(`/images/${img}.jpg`)
                                }
                            >
                                <img
                                    src={`/images/${img}.jpg`}
                                    alt={`Work ${i + 1}`}
                                    className="w-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                        e.target.parentElement.style.background =
                                            "#e8f5e1";
                                        e.target.parentElement.style.minHeight =
                                            "150px";
                                        e.target.style.display = "none";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                                    <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition">
                                        ⤢
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. SKILLS ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Expertise
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Our Skills
                        </h2>
                        <p className="text-gray-500 mt-4">
                            Years of experience reflected in our technical
                            capabilities.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-16">
                        {skills.map((skill) => (
                            <SkillBar key={skill.label} {...skill} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. MAP LOCATION ── */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Find Us
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Our Location
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Contact info */}
                        <div className="space-y-6">
                            {[
                                {
                                    icon: "📍",
                                    label: "Address",
                                    value: "Sungai Buloh, Selangor, Malaysia",
                                },
                                {
                                    icon: "📞",
                                    label: "Phone",
                                    value: "+603 1234 5678",
                                },
                                {
                                    icon: "✉️",
                                    label: "Email",
                                    value: "info@jurukurvisi.com",
                                },
                                {
                                    icon: "🕐",
                                    label: "Hours",
                                    value: "Mon–Fri, 9am–5pm",
                                },
                            ].map(({ icon, label, value }) => (
                                <div
                                    key={label}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
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
                            ))}
                            <Link
                                href="/contact"
                                className="inline-block w-full text-center bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition mt-4"
                            >
                                Book a Consultation →
                            </Link>
                        </div>

                        {/* Leaflet Map */}
                        <div
                            className="md:col-span-2 rounded-2xl overflow-hidden border border-gray-100"
                            style={{ height: "400px" }}
                            id="map"
                        ></div>
                    </div>
                </div>
            </section>

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

            {/* Lightbox */}
            {lightbox && (
                <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
            )}

            {/* Leaflet map script */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        setTimeout(function() {
                            if (typeof L === 'undefined') return;
                            var map = L.map('map').setView([3.2115, 101.5170], 15);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '© OpenStreetMap contributors'
                            }).addTo(map);
                            L.marker([3.2115, 101.5170])
                                .addTo(map)
                                .bindPopup('<b>Jurukur Visi Sdn Bhd</b><br>Sungai Buloh, Selangor')
                                .openPopup();
                        }, 500);
                    `,
                }}
            />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
        </PublicLayout>
    );
}
