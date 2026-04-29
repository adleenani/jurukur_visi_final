// A React component for the staff login page of the Jurukur Visi application.
// This component includes a form for username and password input, with a toggle to show/hide the password, and a link to return to the home page.

import { useForm, usePage } from "@inertiajs/react";
import ToastContainer from "../../Components/ToastContainer";
import { useState } from "react";
import { FaHome } from "react-icons/fa";

// The Login component renders the login form and handles user authentication
export default function Login() {
    const { errors = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    // Handle form submission by sending a POST request to the /login route with the entered username and password
    function submit(e) {
        e.preventDefault();
        post("/login");
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: "linear-gradient(135deg,#022c22,#064e3b,#065f46)",
                backgroundSize: "300% 300%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes gradShift { 0%{background-position:100% 50%} 50%{background-position:0% 50%} 100%{background-position:100% 50%} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .login-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
                .login-input:focus { border-color: #4ade80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.12); outline: none; }
                .login-btn:hover { background: #065f46 !important; }
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
                    {/* Logo mark */}
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
                            fontSize: 22,
                        }}
                    >
                        🗺️
                    </div>
                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#064e3b",
                            letterSpacing: "0.04em",
                        }}
                    >
                        JURUKUR VISI
                    </h1>
                    <p
                        style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 4,
                            fontWeight: 500,
                        }}
                    >
                        Staff Portal · Sign in to continue
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

                {/* Form */}
                <form
                    onSubmit={submit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    {/* Username */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 6,
                                letterSpacing: "0.02em",
                            }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="login-input"
                            style={{
                                width: "100%",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: 10,
                                padding: "10px 14px",
                                fontSize: 13,
                                boxSizing: "border-box",
                            }}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 6,
                                letterSpacing: "0.02em",
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="login-input"
                                style={{
                                    width: "100%",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 10,
                                    padding: "10px 40px 10px 14px",
                                    fontSize: 13,
                                    boxSizing: "border-box",
                                }}
                                placeholder="Enter your password"
                                required
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
                                    alignItems: "center",
                                    padding: 0,
                                }}
                            >
                                {showPassword ? (
                                    <svg
                                        width="17"
                                        height="17"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="17"
                                        height="17"
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
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="login-btn"
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
                            cursor: processing ? "not-allowed" : "pointer",
                            opacity: processing ? 0.6 : 1,
                            marginTop: 4,
                            transition: "all 0.25s ease",
                        }}
                    >
                        {processing ? "Signing in..." : "Sign In →"}
                    </button>
                </form>

                {/* Footer */}
                <div
                    style={{
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <a
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
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
                        <FaHome size={12} />
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}
