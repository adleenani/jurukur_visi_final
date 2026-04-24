import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import ToastContainer from "../../Components/ToastContainer";

export default function ChangePassword() {
    const { errors = {}, flash = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing } = useForm({
        password: "",
        password_confirmation: "",
    });

    const checks = {
        length: data.password.length >= 14,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        number: /[0-9]/.test(data.password),
        symbol: /[^A-Za-z0-9]/.test(data.password),
    };

    const strengthScore = Math.min(
        4,
        Object.values(checks).filter(Boolean).length,
    );

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
    const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][
        strengthScore
    ];

    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;

    function submit(e) {
        e.preventDefault();
        post("/change-password");
    }

    function EyeIcon({ show }) {
        return show ? (
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
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <ToastContainer />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "#d1fae5" }}
                    >
                        <svg
                            width="28"
                            height="28"
                            fill="none"
                            stroke="#15803d"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Set Your Password
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Welcome! Your account was created by an admin. Please
                        set your own private password before continuing.
                    </p>
                </div>

                {/* Warning banner */}
                <div
                    className="flex gap-3 p-4 rounded-xl mb-6"
                    style={{
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                    }}
                >
                    <span className="text-lg flex-shrink-0">⚠️</span>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                        You must set a new password before accessing the system.
                        Your temporary password will no longer work after this.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* New password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            New Password
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
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <EyeIcon show={showPassword} />
                            </button>
                        </div>

                        {/* Strength bar */}
                        {data.password.length > 0 && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                            style={{
                                                background:
                                                    i <= strengthScore
                                                        ? strengthColor
                                                        : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                                <p
                                    className="text-xs font-semibold"
                                    style={{ color: strengthColor }}
                                >
                                    {strengthLabel}
                                </p>
                            </div>
                        )}

                        {/* Checklist */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                            {[
                                {
                                    label: "At least 14 characters",
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

                    {/* Confirm password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none pr-10 transition"
                                style={{
                                    borderColor: data.password_confirmation
                                        ? passwordsMatch
                                            ? "#22c55e"
                                            : "#ef4444"
                                        : "#e5e7eb",
                                }}
                                placeholder="Re-enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <EyeIcon show={showConfirm} />
                            </button>
                        </div>

                        {/* Match indicator */}
                        {data.password_confirmation && (
                            <p
                                className="text-xs mt-1 font-medium"
                                style={{
                                    color: passwordsMatch
                                        ? "#15803d"
                                        : "#ef4444",
                                }}
                            >
                                {passwordsMatch
                                    ? "✓ Passwords match"
                                    : "✕ Passwords do not match"}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={
                            processing || !passwordsMatch || strengthScore < 3
                        }
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                        style={{ background: "#15803d" }}
                    >
                        {processing ? "Saving..." : "Set My Password"}
                    </button>

                    {/* Hint */}
                    {strengthScore < 3 && data.password.length > 0 && (
                        <p className="text-center text-xs text-gray-400">
                            Password must be at least "Good" strength to
                            continue
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
