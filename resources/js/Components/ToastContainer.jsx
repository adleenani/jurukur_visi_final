import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Toast from './Toast';

export default function ToastContainer() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);

    function addToast(message, sub, type) {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, sub, type }]);
    }

    function removeToast(id) {
        setToasts(prev => prev.filter(t => t.id !== id));
    }

    useEffect(() => {
        if (flash?.success) addToast(flash.success, null, 'success');
        if (flash?.message) addToast(flash.message, null, 'info');
        if (flash?.error)   addToast(flash.error, null, 'error');

        // Show first validation error if any
        const errorValues = Object.values(errors ?? {});
        if (errorValues.length > 0) {
            addToast('Please check the form', errorValues[0], 'error');
        }
    }, [flash, errors]);

    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
                @keyframes toastIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes toastOut {
                    from { transform: translateX(0);    opacity: 1; }
                    to   { transform: translateX(120%); opacity: 0; }
                }
                @keyframes toastCountdown {
                    from { stroke-dashoffset: 0;  }
                    to   { stroke-dashoffset: 57; }
                }
                @keyframes toastShrink {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none',
            }}>
                {toasts.map(toast => (
                    <div key={toast.id} style={{ pointerEvents: 'all' }}>
                        <Toast
                            message={toast.message}
                            sub={toast.sub}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}