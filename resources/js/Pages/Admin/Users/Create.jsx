import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Create() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        full_name: "",
        email: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/admin/users/create");
    }

    const checks = {
        length: data.password.length >= 15,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        number: /[0-9]/.test(data.password),
        symbol: /[^A-Za-z0-9]/.test(data.password),
    };
    const strengthScore = Math.min(
        4,
        Object.values(checks).filter(Boolean).length,
    );

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Staff Account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create a new PIC staff account. The account will be
                        active immediately.
                    </p>
                </div>
                <Link
                    href="/admin/users"
                    className="px-5 py-2.5 rounded-full text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                    ← Back
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-lg mx-auto">
                {/* Info banner */}
                <div
                    className="flex gap-3 p-4 rounded-xl mb-6"
                    style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                    }}
                >
                    <span className="text-green-700 text-lg flex-shrink-0">
                        ℹ️
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-green-800">
                            Admin-created account
                        </p>
                        <p className="text-xs text-green-700 mt-1 leading-relaxed">
                            This account will be immediately active. Share the
                            username and password securely with the staff
                            member. They should change their password after
                            first login.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Full name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            placeholder="e.g. Ahmad Farid bin Ismail"
                            required
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            placeholder="e.g. ahmadfarid"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            4–30 characters, letters and numbers only
                        </p>
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            placeholder="e.g. ahmad@jurukurvisi.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Temporary Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 pr-10"
                                placeholder="Create a strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? (
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Strength bar */}
                        {data.password.length > 0 && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1 flex-1 rounded-full transition-all duration-300"
                                            style={{
                                                background:
                                                    i <= strengthScore
                                                        ? strengthScore === 1
                                                            ? "#ef4444"
                                                            : strengthScore ===
                                                                2
                                                            ? "#f97316"
                                                            : strengthScore ===
                                                                3
                                                                ? "#eab308"
                                                                : "#22c55e"
                                                        : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                                <p
                                    className="text-xs font-semibold mb-2"
                                    style={{
                                        color:
                                            strengthScore === 1
                                                ? "#ef4444"
                                                : strengthScore === 2
                                                ? "#f97316"
                                                : strengthScore === 3
                                                    ? "#eab308"
                                                    : "#22c55e",
                                    }}
                                >
                                    {strengthScore === 1
                                        ? "Weak"
                                        : strengthScore === 2
                                        ? "Fair"
                                        : strengthScore === 3
                                            ? "Good"
                                            : "Strong"}
                                </p>
                            </div>
                        )}

                        {/* Checklist */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                            {[
                                {
                                    label: "At least 15 characters",
                                    met: checks.length,
                                },
                                {
                                    label: "One uppercase letter",
                                    met: checks.uppercase,
                                },
                                {
                                    label: "One lowercase letter",
                                    met: checks.lowercase,
                                },
                                { label: "One number", met: checks.number },
                                { label: "One symbol", met: checks.symbol },
                            ].map(({ label, met }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-1.5"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                        style={{
                                            background: met
                                                ? "#d1fae5"
                                                : "#f3f4f6",
                                        }}
                                    >
                                        {met ? (
                                            <svg
                                                width="10"
                                                height="10"
                                                fill="none"
                                                stroke="#15803d"
                                                strokeWidth="2.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <div
                                                style={{
                                                    width: "4px",
                                                    height: "4px",
                                                    borderRadius: "50%",
                                                    background: "#9ca3af",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className="text-xs transition-all duration-200"
                                        style={{
                                            color: met ? "#15803d" : "#9ca3af",
                                            fontWeight: met ? 600 : 400,
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                        style={{ background: "#15803d" }}
                    >
                        {processing ? "Creating..." : "Create Staff Account"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
