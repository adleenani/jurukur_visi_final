import PublicLayout from "../Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

// Services data
const services = [
    { icon: "📐", title: "Cadastral Survey" },
    { icon: "🗺️", title: "Topographic Mapping" },
    { icon: "🏗️", title: "Engineering Survey" },
    { icon: "🏢", title: "Strata Title" },
    { icon: "📡", title: "GPS Survey" },
    { icon: "⚙️", title: "Underground Utilities" },
];

// Work gallery images (without extension)
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

// Lightbox component for viewing images in full size
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
                style={{ position: "relative" }}
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
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

// Counter component that animates counting up when it comes into view
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

// Main Home component
export default function Home({ stats }) {
    const [lightbox, setLightbox] = useState(null);

    // Load Leaflet map after component mounts
    useEffect(() => {
        let map = null;

        const loadMap = () => {
            const el = document.getElementById("home-map");
            if (!el || el._leaflet_id) return;

            if (typeof window.L !== "undefined") {
                initLeaflet();
            } else {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);

                const script = document.createElement("script");
                script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                script.onload = initLeaflet;
                document.head.appendChild(script);
            }
        };

        // Initialize Leaflet map
        function initLeaflet() {
            const el = document.getElementById("home-map");
            if (!el || el._leaflet_id) return;
            map = window.L.map("home-map").setView([3.1985, 101.5119], 16);
            window.L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: "© OpenStreetMap contributors",
                },
            ).addTo(map);
            window.L.marker([3.1985, 101.5119])
                .addTo(map)
                .bindPopup(
                    "<b>Jurukur Visi Sdn Bhd</b><br>6F2P+98 Sungai Buloh, Selangor",
                )
                .openPopup();
        }

        const timer = setTimeout(loadMap, 800);

        return () => {
            clearTimeout(timer);
            if (map) map.remove();
        };
    }, []);

    return (
        <PublicLayout>
            {/* ── 1. HERO ── */}
            <section
                className="relative min-h-screen flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6,78,59,0.82), rgba(4,120,87,0.82)), url(/images/back_img.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    overflow: "hidden",
                }}
            >
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10 py-20">
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

                    {/* Quick stats */}
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

            {/* ── 2. SERVICES (simplified) ── */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            What We Do
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-3">
                            Our Services
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {services.map(({ icon, title }) => (
                            <div
                                key={title}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition duration-300 flex items-center gap-4"
                            >
                                <span className="text-3xl flex-shrink-0">
                                    {icon}
                                </span>
                                <h3 className="font-bold text-gray-800">
                                    {title}
                                </h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link
                            href="/about"
                            className="inline-block text-green-700 font-semibold text-sm hover:underline"
                        >
                            Learn more about our services →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 3. STATISTICS ── */}
            <section className="py-20 px-6 bg-green-800 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">
                            By The Numbers
                        </span>
                        <h2 className="text-3xl font-bold mt-3">
                            Our Track Record
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
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

            {/* ── 4. WORK GALLERY ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Our Work
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-3">
                            Work in the Field
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm">
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

            {/* ── 5. CTA BANNER ── */}
            <section
                className="py-20 px-6 text-center"
                style={{
                    background: "linear-gradient(135deg, #064e3b, #065f46)",
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to start your project?
                    </h2>
                    <p className="text-green-200 text-sm mb-8 leading-relaxed">
                        Book a consultation with our licensed surveyors today.
                        We cover all states across Malaysia.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="bg-white text-green-800 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-green-50 transition"
                        >
                            Book a Consultation →
                        </Link>
                        <Link
                            href="/about"
                            className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white hover:text-green-800 transition"
                        >
                            Learn About Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 6. MAP SECTION ── */}
            <section className="px-6 py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">
                            Find Us
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-3">
                            Our Location
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Contact info */}
                        <div className="space-y-5">
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
                                className="inline-block w-full text-center bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition mt-2"
                            >
                                Book a Consultation →
                            </Link>
                        </div>

                        {/* Map container */}
                        <div
                            id="home-map"
                            className="md:col-span-2 rounded-2xl overflow-hidden border border-gray-100"
                            style={{ height: "380px", zIndex: 1 }}
                        />
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
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

                    {/* Quick Links */}
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

                    {/* Contact */}
                    <div>
                        <p className="text-white font-medium mb-3">Contact</p>
                        <div className="space-y-2 text-sm">
                            <p>📍 Sungai Buloh, Selangor</p>
                            <p>📞 +603 1234 5678</p>
                            <p>✉️ info@jurukurvisi.com</p>
                        </div>
                    </div>

                    {/* Find Us */}
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

                {/* Copyright */}
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
