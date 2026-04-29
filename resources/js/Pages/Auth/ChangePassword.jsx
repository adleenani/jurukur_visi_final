// This page allows users to set a new password after their account has been created by an admin.
// It includes real-time password strength feedback and validation to ensure a strong password is chosen.

import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import ToastContainer from "../../Components/ToastContainer";

// The component renders a form for users to set a new password, with real-time strength feedback and validation checks.
export default function ChangePassword() {
    const { errors = {}, flash = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Initialize form state with Inertia's useForm hook, starting with empty password fields
    const { data, setData, post, processing } = useForm({
        password: "",
        password_confirmation: "",
    });

    // Define checks for password strength criteria
    const checks = {
        length: data.password.length >= 14,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        number: /[0-9]/.test(data.password),
        symbol: /[^A-Za-z0-9]/.test(data.password),
    };

    // Calculate strength score based on how many criteria are met, with a maximum of 4 (excluding length which is required)
    const strengthScore = Math.min(
        4,
        Object.values(checks).filter(Boolean).length,
    );

    // Map strength score to a label and color for the strength bar
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
    const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][
        strengthScore
    ];

    // Check if password and confirmation match for validation before submission
    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;

    // Handle form submission to set the new password, sending a POST request to the server
    function submit(e) {
        e.preventDefault();
        post("/change-password");
    }

    //  Component for the eye icon used to toggle password visibility, changing appearance based on whether the password is currently shown or hidden
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
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .pw-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
                .pw-input:focus { border-color: #4ade80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.12); outline: none; }
                .submit-btn:hover:not(:disabled) { background: #065f46 !important; }
            `}</style>

            <ToastContainer />

            {/* Decorative rings */}
            <div
                style={{
                    position: "absolute",
                    top: -80,
                    right: -80,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    border: "1px solid rgba(110,231,183,0.1)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -60,
                    left: -60,
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    border: "1px solid rgba(110,231,183,0.08)",
                    pointerEvents: "none",
                }}
            />

            {/* Card — two column */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    maxWidth: 780,
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                    animation: "fadeUp 0.6s cubic-bezier(.22,1,.36,1) both",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                }}
            >
                {/* ── LEFT: Info panel ── */}
                <div
                    style={{
                        background: "linear-gradient(160deg,#064e3b,#065f46)",
                        padding: "36px 32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative ring inside panel */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: -40,
                            right: -40,
                            width: 160,
                            height: 160,
                            borderRadius: "50%",
                            border: "1px solid rgba(110,231,183,0.15)",
                            pointerEvents: "none",
                        }}
                    />

                    <div>
                        {/* Icon */}
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: "rgba(255,255,255,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 20,
                            }}
                        >
                            <svg
                                width="22"
                                height="22"
                                fill="none"
                                stroke="#4ade80"
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

                        <h1
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#fff",
                                marginBottom: 8,
                            }}
                        >
                            Set Your Password
                        </h1>
                        <p
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.65)",
                                lineHeight: 1.7,
                                marginBottom: 24,
                            }}
                        >
                            Welcome! Your account was created by an admin.
                            Please set your own private password before
                            continuing.
                        </p>

                        {/* Warning banner */}
                        <div
                            style={{
                                background: "rgba(253,230,138,0.12)",
                                border: "1px solid rgba(253,230,138,0.3)",
                                borderRadius: 12,
                                padding: "12px 14px",
                                display: "flex",
                                gap: 10,
                            }}
                        >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>
                                ⚠️
                            </span>
                            <p
                                style={{
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.75)",
                                    lineHeight: 1.6,
                                }}
                            >
                                You must set a new password before accessing the
                                system. Your temporary password will no longer
                                work after this.
                            </p>
                        </div>
                    </div>

                    {/* Requirements list */}
                    <div style={{ marginTop: 28 }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.4)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 10,
                            }}
                        >
                            Password Requirements
                        </p>
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
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 7,
                                }}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        background: met
                                            ? "#4ade80"
                                            : "rgba(255,255,255,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "background 0.2s",
                                    }}
                                >
                                    {met ? (
                                        <svg
                                            width="9"
                                            height="9"
                                            fill="none"
                                            stroke="#052e16"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <div
                                            style={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: "50%",
                                                background:
                                                    "rgba(255,255,255,0.3)",
                                            }}
                                        />
                                    )}
                                </div>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: met
                                            ? "#4ade80"
                                            : "rgba(255,255,255,0.45)",
                                        fontWeight: met ? 600 : 400,
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Form ── */}
                <div
                    style={{
                        padding: "36px 32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 18,
                    }}
                >
                    {/* New password */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#374151",
                                marginBottom: 5,
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                            }}
                        >
                            New Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="pw-input"
                                style={{
                                    width: "100%",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 9,
                                    padding: "10px 38px 10px 13px",
                                    fontSize: 13,
                                    boxSizing: "border-box",
                                }}
                                placeholder="Create a strong password"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#9ca3af",
                                    display: "flex",
                                    padding: 0,
                                }}
                            >
                                {showPassword ? (
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="16"
                                        height="16"
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
                            <div style={{ marginTop: 8 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 4,
                                        marginBottom: 4,
                                    }}
                                >
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            style={{
                                                height: 4,
                                                flex: 1,
                                                borderRadius: 99,
                                                background:
                                                    i <= strengthScore
                                                        ? strengthColor
                                                        : "#e5e7eb",
                                                transition: "background 0.3s",
                                            }}
                                        />
                                    ))}
                                </div>
                                <p
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: strengthColor,
                                    }}
                                >
                                    {strengthLabel}
                                </p>
                            </div>
                        )}
                        {errors.password && (
                            <p
                                style={{
                                    fontSize: 10,
                                    color: "#dc2626",
                                    marginTop: 4,
                                }}
                            >
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "#f3f4f6" }} />

                    {/* Confirm password */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#374151",
                                marginBottom: 5,
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                            }}
                        >
                            Confirm New Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                style={{
                                    width: "100%",
                                    borderRadius: 9,
                                    border: `1.5px solid ${data.password_confirmation ? (passwordsMatch ? "#22c55e" : "#ef4444") : "#e5e7eb"}`,
                                    padding: "10px 38px 10px 13px",
                                    fontSize: 13,
                                    boxSizing: "border-box",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                placeholder="Re-enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#9ca3af",
                                    display: "flex",
                                    padding: 0,
                                }}
                            >
                                <EyeIcon show={showConfirm} />
                            </button>
                        </div>
                        {data.password_confirmation && (
                            <p
                                style={{
                                    fontSize: 11,
                                    marginTop: 4,
                                    fontWeight: 600,
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

                    {/* Submit */}
                    <button
                        type="submit"
                        onClick={submit}
                        disabled={
                            processing || !passwordsMatch || strengthScore < 3
                        }
                        className="submit-btn"
                        style={{
                            width: "100%",
                            background:
                                "linear-gradient(135deg,#064e3b,#065f46)",
                            color: "#fff",
                            padding: "12px",
                            borderRadius: 9,
                            fontSize: 13,
                            fontWeight: 700,
                            border: "none",
                            cursor:
                                processing ||
                                !passwordsMatch ||
                                strengthScore < 3
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                processing ||
                                !passwordsMatch ||
                                strengthScore < 3
                                    ? 0.5
                                    : 1,
                            transition: "all 0.25s ease",
                        }}
                    >
                        {processing ? "Saving..." : "Set My Password →"}
                    </button>

                    {strengthScore < 3 && data.password.length > 0 && (
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 11,
                                color: "#9ca3af",
                            }}
                        >
                            Password must be at least "Good" strength to
                            continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
