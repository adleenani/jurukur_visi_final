import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const links = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Book a Consultation", href: "/contact" },
    ];

    return (

        // Desktop: flex with gap, Mobile: hidden until hamburger clicked
        <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* Logo + Brand */}
                <Link href="/" className="flex items-center gap-2.5">
                    <img
                        src="/images/jvisi_logo.png"
                        alt="Jurukur Visi Logo"
                        style={{
                            height: "38px",
                            width: "auto",
                            objectFit: "contain",
                        }}
                    />
                    <span className="text-green-800 font-bold text-lg tracking-wide">
                        JURUKUR VISI
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                    {links.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-gray-600 hover:text-green-700 transition font-medium"
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800 transition text-sm"
                    >
                        Staff Login
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-600 p-1"
                    aria-label="Toggle menu"
                >
                    <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {open ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white shadow-md">
                    <div className="px-6 py-4 space-y-1">
                        {links.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className="flex items-center py-3 text-sm font-medium text-gray-700 hover:text-green-700 border-b border-gray-50 transition"
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="pt-3">
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="block w-full text-center bg-green-700 text-white px-4 py-3 rounded-full font-semibold hover:bg-green-800 transition text-sm"
                            >
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
