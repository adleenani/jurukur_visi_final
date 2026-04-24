import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import ToastContainer from "../Components/ToastContainer";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function logout() {
        router.post("/logout");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                fixed h-full z-30 w-56 bg-green-800 text-white flex flex-col
                transition-transform duration-200
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
            >
                <div className="px-6 py-6 border-b border-green-700">
                    <p className="font-medium text-sm">JURUKUR VISI</p>
                    <p className="text-green-300 text-xs mt-1">Staff Portal</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Projects", href: "/admin/projects" },
                        { label: "Bookings", href: "/admin/bookings" },
                        { label: 'Staff',    href: '/admin/users' },
                    ].map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className="block px-4 py-2.5 rounded-lg text-sm text-green-100 hover:bg-green-700 transition"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="px-4 py-6 border-t border-green-700">
                    <p className="text-green-300 text-xs mb-3">
                        Logged in as {auth?.user ?? "Staff"}
                    </p>
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-green-100 hover:bg-green-700 transition"
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="lg:ml-56 flex-1 min-w-0">
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center gap-4 px-4 py-3 bg-green-800 text-white sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white p-1"
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    </button>
                    <span className="font-medium text-sm">JURUKUR VISI</span>
                </div>
                <div className="p-4 lg:p-8">{children}</div>
            </main>
            <ToastContainer />
        </div>
    );
}
