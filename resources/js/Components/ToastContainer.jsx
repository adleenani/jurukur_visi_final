import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Toast from "./Toast";

export default function ToastContainer() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);

    // Add a new toast
    function addToast(message, type) {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    }

    // Remove toast by ID
    function removeToast(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    useEffect(() => {
        if (flash?.success) addToast(flash.success, "success");
        if (flash?.message) addToast(flash.message, "info");
        if (flash?.error) addToast(flash.error, "error");

        const errorValues = Object.values(errors ?? {});
        if (errorValues.length === 1) {
            // Single error — show directly
            addToast(errorValues[0], "error");
        } else if (errorValues.length > 1) {
            // Multiple errors — combine into one message
            const combined = errorValues.join("\n");
            addToast(combined, "error");
        }
    }, [flash?.success, flash?.message, flash?.error, JSON.stringify(errors)]);

    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
            @keyframes toastUp {
                from { transform: translateY(-30px); opacity: 0; }
                to   { transform: translateY(0);     opacity: 1; }
            }
            @keyframes toastDown {
                from { transform: translateY(0);     opacity: 1; }
                to   { transform: translateY(-30px); opacity: 0; }
            }
            @keyframes toastCountdown {
                from { stroke-dashoffset: 0;  }
                to   { stroke-dashoffset: 63; }
            }
            // @keyframes toastShrink {
            //     from { width: 100%; }
            //     to   { width: 0%;   }
            // }
        `}</style>
            <div
                style={{
                    position: "fixed",
                    top: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    pointerEvents: "none",
                    width: "max-content",
                    maxWidth: "90vw",
                }}
            >
                {toasts.map((toast) => (
                    <div key={toast.id} style={{ pointerEvents: "all" }}>
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
