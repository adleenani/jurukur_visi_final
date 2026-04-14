import { Link, router, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    function logout() {
        router.post("/logout");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-56 bg-green-800 text-white flex flex-col fixed h-full">
                <div className="px-6 py-6 border-b border-green-700">
                    <p className="font-medium text-sm">JURUKUR VISI</p>
                    <p className="text-green-300 text-xs mt-1">Staff Portal</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Projects", href: "/admin/projects" },
                        { label: "Bookings", href: "/admin/bookings" },
                    ].map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
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
            <main className="ml-56 flex-1 p-8">{children}</main>
        </div>
    );
}
