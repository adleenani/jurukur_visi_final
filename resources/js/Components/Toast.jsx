import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(true);

    const colors = {
        success: {
            bg: "#15803d",
            ring: "rgba(255,255,255,0.3)",
            bar: "rgba(255,255,255,0.5)",
        },
        error: {
            bg: "#dc2626",
            ring: "rgba(255,255,255,0.3)",
            bar: "rgba(255,255,255,0.5)",
        },
        info: {
            bg: "#1d4ed8",
            ring: "rgba(255,255,255,0.3)",
            bar: "rgba(255,255,255,0.5)",
        },
    };

    const icons = {
        success: "✓",
        error: "✕",
        info: "i",
    };

    const c = colors[type] ?? colors.success;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                background: c.bg,
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                maxWidth: "380px",
                width: "max-content",
                animation: visible
                    ? "toastUp 0.35s cubic-bezier(.21,1.02,.73,1) forwards"
                    : "toastDown 0.3s ease forwards",
            }}
        >
            {/* Icon */}
            <span
                style={{
                    fontSize: "15px",
                    color: "white",
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                {icons[type]}
            </span>

            {/* Message */}
            <span
                style={{
                    fontSize: "14px",
                    color: "white",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    flex: 1,
                }}
            >
                {message}
            </span>

            {/* Timer close button */}
            <div
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
                style={{
                    position: "relative",
                    width: "24px",
                    height: "24px",
                    flexShrink: 0,
                    cursor: "pointer",
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ transform: "rotate(-90deg)" }}
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="2.5"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="63"
                        strokeDashoffset="0"
                        style={{
                            animation: "toastCountdown 10s linear forwards",
                        }}
                    />
                </svg>
                <span
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.8)",
                    }}
                >
                    ✕
                </span>
            </div>

            {/* Progress bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    background: c.bar,
                    animation: "toastShrink 10s linear forwards",
                }}
            />
        </div>
    );
}
