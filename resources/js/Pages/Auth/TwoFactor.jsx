// The TwoFactor component renders the 2FA verification page where users can enter the 6-digit code sent to their email.

import { useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ToastContainer from "../../Components/ToastContainer";

// The TwoFactor component renders the 2FA verification page where users can enter the 6-digit code sent to their email.
export default function TwoFactor() {
    const { errors = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(600); // 10 minutes
    const { data, setData, post, processing } = useForm({ code: "" });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format countdown as MM:SS
    const minutes = Math.floor(countdown / 60);

    // Format seconds with leading zero
    const seconds = countdown % 60;

    // Handle form submission to verify the 2FA code via POST request
    function submit(e) {
        e.preventDefault();
        post("/2fa");
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .verify-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
                .verify-input:focus { border-color: #4ade80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.12); outline: none; }
                .verify-btn:hover:not(:disabled) { background: #065f46 !important; }
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
                    top: -40,
                    right: -40,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: "1px solid rgba(110,231,183,0.15)",
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

            {/* Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                    padding: "40px 36px",
                    width: "100%",
                    maxWidth: 420,
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                    animation: "fadeUp 0.6s cubic-bezier(.22,1,.36,1) both",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            background:
                                "linear-gradient(135deg,#064e3b,#065f46)",
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 14px",
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
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#064e3b",
                        }}
                    >
                        Check your email
                    </h1>
                    <p
                        style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 6,
                            lineHeight: 1.6,
                        }}
                    >
                        We sent a 6-digit verification code to your registered
                        email address.
                    </p>
                </div>

                {/* Divider */}
                <div
                    style={{
                        height: 1,
                        background: "#f3f4f6",
                        marginBottom: 24,
                    }}
                />

                {/* Error */}
                {errors.code && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: 12,
                            marginBottom: 16,
                            border: "1px solid #fecaca",
                        }}
                    >
                        {errors.code}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={submit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 8,
                                textAlign: "center",
                                letterSpacing: "0.02em",
                            }}
                        >
                            Enter your 6-digit code
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) =>
                                setData(
                                    "code",
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6),
                                )
                            }
                            className="verify-input"
                            style={{
                                width: "100%",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: 12,
                                padding: "14px",
                                textAlign: "center",
                                fontSize: 28,
                                fontWeight: 800,
                                letterSpacing: "0.3em",
                                color: "#064e3b",
                                boxSizing: "border-box",
                            }}
                            placeholder="000000"
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>

                    {/* Countdown */}
                    <div style={{ textAlign: "center" }}>
                        {countdown > 0 ? (
                            <p style={{ fontSize: 12, color: "#9ca3af" }}>
                                Code expires in{" "}
                                <span
                                    style={{
                                        fontWeight: 700,
                                        color:
                                            countdown < 60
                                                ? "#dc2626"
                                                : "#15803d",
                                    }}
                                >
                                    {minutes}:{String(seconds).padStart(2, "0")}
                                </span>
                            </p>
                        ) : (
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "#dc2626",
                                    fontWeight: 600,
                                }}
                            >
                                Code expired. Please login again.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={
                            processing ||
                            countdown === 0 ||
                            data.code.length < 6
                        }
                        className="verify-btn"
                        style={{
                            width: "100%",
                            background:
                                "linear-gradient(135deg,#064e3b,#065f46)",
                            color: "#fff",
                            padding: "12px",
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 700,
                            border: "none",
                            cursor:
                                processing ||
                                countdown === 0 ||
                                data.code.length < 6
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                processing ||
                                countdown === 0 ||
                                data.code.length < 6
                                    ? 0.5
                                    : 1,
                            transition: "all 0.25s ease",
                        }}
                    >
                        {processing ? "Verifying..." : "Verify Code →"}
                    </button>
                </form>

                {/* Footer links */}
                <div
                    style={{
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <a
                        href="/login"
                        style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            textDecoration: "none",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#065f46")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#9ca3af")
                        }
                    >
                        ← Back to login
                    </a>
                    <a
                        href="/login"
                        style={{
                            fontSize: 12,
                            color: "#065f46",
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                        }
                    >
                        Try again
                    </a>
                </div>
            </div>
        </div>
    );
}
