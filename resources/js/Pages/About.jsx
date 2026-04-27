import PublicLayout from "../Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

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

const services = [
    {
        icon: "📐",
        title: "Cadastral Survey",
        desc: "Precise boundary surveys for land ownership, subdivision and title registration with JUPEM.",
    },
    {
        icon: "🗺️",
        title: "Topographic Mapping",
        desc: "Detailed terrain and feature mapping for planning, engineering and development projects.",
    },
    {
        icon: "🏗️",
        title: "Engineering Survey",
        desc: "Construction setting-out, as-built surveys and infrastructure positioning for engineers.",
    },
    {
        icon: "🏢",
        title: "Strata Title",
        desc: "Strata title surveys for stratified developments including condominiums and commercial buildings.",
    },
    {
        icon: "📡",
        title: "GPS Survey",
        desc: "High-precision GNSS/GPS positioning for large-scale mapping and control network establishment.",
    },
    {
        icon: "⚙️",
        title: "Underground Utilities",
        desc: "Detection and mapping of underground utility networks using ground penetrating radar technology.",
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
    // {
    //     icon: "✓",
    //     title: "ISO Compliant",
    //     sub: "Quality Management System",
    //     bg: "#ede9fe",
    //     color: "#6d28d9",
    // },
];

function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                {children}
            </p>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
    );
}

export default function About({ stats }) {
    const projectCount = stats?.projects ?? 0;

    return (
        <PublicLayout>
            {/* ── HERO ── */}
            <section
                className="px-6 py-14"
                style={{
                    background: "linear-gradient(135deg, #064e3b, #065f46)",
                }}
            >
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block text-xs font-bold text-green-300 uppercase tracking-widest bg-green-900 bg-opacity-50 px-3 py-1 rounded-full mb-4">
                            Est. 2005 · Sungai Buloh, Selangor
                        </span>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            About
                            <br />
                            <span className="text-green-300">Jurukur Visi</span>
                            <br />
                            Sdn Bhd
                        </h1>
                        <p className="text-green-100 text-sm leading-relaxed">
                            A licensed Bumiputera-owned surveying and mapping
                            consultancy delivering precision solutions across
                            Malaysia for over 12 years.
                        </p>
                    </div>
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
                            >
                                <img
                                    src={src}
                                    alt={`Survey work ${i + 1}`}
                                    className="w-full h-32 object-cover hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                        e.target.parentElement.style.background =
                                            "#d1fae5";
                                        e.target.parentElement.style.minHeight =
                                            "128px";
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section style={{ background: "#053d30" }}>
                <div className="max-w-6xl mx-auto grid grid-cols-4">
                    {[
                        {
                            num: projectCount,
                            suffix: "+",
                            label: "Projects Done",
                        },
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
                            }}
                        >
                            <p
                                className="text-2xl font-bold"
                                style={{ color: "#4ade80" }}
                            >
                                <Counter target={num} suffix={suffix} />
                            </p>
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
                        <SectionTitle>Mission & Vision</SectionTitle>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div
                                className="rounded-2xl p-7"
                                style={{
                                    background: "#f0fdf4",
                                    border: "0.5px solid #bbf7d0",
                                }}
                            >
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="font-bold text-green-900 mb-3">
                                    Our Mission
                                </h3>
                                <p className="text-sm text-green-800 leading-relaxed">
                                    To deliver precise, reliable and
                                    professional surveying and mapping services
                                    that support sustainable infrastructure
                                    development and land management across
                                    Malaysia.
                                </p>
                            </div>
                            <div
                                className="rounded-2xl p-7"
                                style={{
                                    background: "#eff6ff",
                                    border: "0.5px solid #bfdbfe",
                                }}
                            >
                                <div className="text-3xl mb-3">🔭</div>
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
                            </div>
                        </div>
                    </div>

                    {/* ── COMPANY PROFILE ── */}
                    <div>
                        <SectionTitle>Company Profile</SectionTitle>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Image grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {["/images/visi5.jpg", "/images/visi6.jpg"].map(
                                    (src, i) => (
                                        <div
                                            key={src}
                                            className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? "mt-6" : ""}`}
                                        >
                                            <img
                                                src={src}
                                                alt={`Company ${i + 1}`}
                                                className="w-full h-44 object-cover hover:scale-105 transition duration-300"
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
                                    ),
                                )}
                            </div>

                            {/* Text */}
                            <div>
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
                                        // {
                                        //     label: "✓ JUPEM Licensed",
                                        //     bg: "#d1fae5",
                                        //     color: "#065f46",
                                        // },
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
                            </div>
                        </div>
                    </div>

                    {/* ── SERVICES ── */}
                    <div>
                        <SectionTitle>Our Services</SectionTitle>
                        <div className="grid md:grid-cols-3 gap-5">
                            {services.map(({ icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition duration-300 group"
                                >
                                    <div className="text-3xl mb-3">{icon}</div>
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

                    {/* ── TEAM ── */}
                    <div>
                        <SectionTitle>Meet Our Team</SectionTitle>
                        <p className="text-gray-500 text-sm mb-6">
                            Our licensed surveyors and specialists bring decades
                            of combined experience.
                        </p>
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
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
                            ].map(({ name, role, exp }) => {
                                const parts = name.trim().split(" ");
                                const initials = (
                                    parts[0][0] + parts[parts.length - 1][0]
                                ).toUpperCase();
                                return (
                                    <div
                                        key={name}
                                        className="text-center group"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-green-700 group-hover:bg-green-700 group-hover:text-white transition duration-300">
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

                    {/* ── EQUIPMENT ── */}
                    <div>
                        <SectionTitle>Our Equipment</SectionTitle>
                        <div className="grid md:grid-cols-4 gap-5">
                            {equipment.map(({ img, name, desc }) => (
                                <div
                                    key={name}
                                    className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition duration-300"
                                >
                                    <img
                                        src={img}
                                        alt={name}
                                        className="w-full h-36 object-cover"
                                        onError={(e) => {
                                            e.target.parentElement.style.background =
                                                "#f0fdf4";
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <div className="p-4 bg-white">
                                        <p className="font-bold text-gray-800 text-sm">
                                            {name}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── COLLABORATIONS ── */}
                    <div>
                        <SectionTitle>Collaborations & Clients</SectionTitle>
                        <div className="grid md:grid-cols-4 gap-5">
                            {collaborations.map(
                                ({ abbr, name, type, bg, color }) => (
                                    <div
                                        key={name}
                                        className="rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition duration-300"
                                    >
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                                            style={{ background: bg, color }}
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
                                ),
                            )}
                        </div>
                    </div>

                    {/* ── CERTIFICATIONS ── */}
                    <div>
                        <SectionTitle>
                            Certifications & Accreditations
                        </SectionTitle>
                        <div className="grid md:grid-cols-3 gap-5">
                            {certifications.map(
                                ({ icon, title, sub, bg, color }) => (
                                    <div
                                        key={title}
                                        className="rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition duration-300"
                                    >
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                                            style={{ background: bg }}
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
                                ),
                            )}
                        </div>
                    </div>

                    {/* ── CTA ── */}
                    <div
                        className="rounded-2xl p-10 text-center"
                        style={{
                            background:
                                "linear-gradient(135deg, #064e3b, #065f46)",
                        }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Ready to start your project?
                        </h2>
                        <p className="text-green-200 text-sm mb-6">
                            Book a consultation with our team and get a project
                            quote.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-white text-green-800 px-8 py-3 rounded-full font-bold text-sm hover:bg-green-50 transition"
                        >
                            Book a Consultation →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
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
        </PublicLayout>
    );
}
