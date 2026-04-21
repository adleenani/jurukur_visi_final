import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-green-800 font-medium text-lg tracking-wide"
                >
                    JURUKUR VISI
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8 text-sm">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-green-700 transition"
                    >
                        Home
                    </Link>
                    <Link
                        href="/projects"
                        className="text-gray-600 hover:text-green-700 transition"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-600 hover:text-green-700 transition"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/login"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                    >
                        Staff Login
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-600 p-1"
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
                <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-3 text-sm bg-white">
                    {[
                        { label: "Home", href: "/" },
                        { label: "Projects", href: "/projects" },
                        { label: "Contact", href: "/contact" },
                    ].map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="block text-gray-600 hover:text-green-700 py-1"
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="block bg-green-700 text-white px-4 py-2 rounded-lg text-center hover:bg-green-800 transition"
                    >
                        Staff Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
