import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-green-800 font-medium text-lg tracking-wide">
                    JURUKUR VISI
                </Link>
                <div className="flex items-center gap-8 text-sm">
                    <Link href="/" className="text-gray-600 hover:text-green-700 transition">Home</Link>
                    <Link href="/projects" className="text-gray-600 hover:text-green-700 transition">Projects</Link>
                    <Link href="/contact" className="text-gray-600 hover:text-green-700 transition">Contact</Link>
                    <Link
                        href="/login"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                    >
                        Staff Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}