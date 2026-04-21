import { useEffect, useState } from 'react';

export default function Toast({ message, sub, type = 'success', onClose }) {
    const [visible, setVisible] = useState(true);

    const colors = {
        success: { bg: '#dcfce7', text: '#166534', bar: '#16a34a', ring: '#16a34a' },
        error:   { bg: '#fee2e2', text: '#991b1b', bar: '#dc2626', ring: '#dc2626' },
        info:    { bg: '#dbeafe', text: '#1e40af', bar: '#2563eb', ring: '#2563eb' },
    };

    const icons = {
        success: '✓',
        error:   '✕',
        info:    'i',
    };

    const c = colors[type] ?? colors.success;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                background: 'white',
                borderRadius: '12px',
                border: '0.5px solid #e5e7eb',
                minWidth: '290px',
                maxWidth: '340px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                animation: visible
                    ? 'toastIn 0.35s cubic-bezier(.21,1.02,.73,1) forwards'
                    : 'toastOut 0.3s ease forwards',
            }}
        >
            {/* Avatar icon */}
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: c.bg,
                color: c.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                flexShrink: 0,
            }}>
                {icons[type]}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827', margin: 0 }}>
                    {message}
                </p>
                {sub && (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '3px 0 0' }}>
                        {sub}
                    </p>
                )}
            </div>

            {/* Circular timer close button */}
            <div
                onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
                style={{ position: 'relative', width: '22px', height: '22px', flexShrink: 0, cursor: 'pointer', marginTop: '2px' }}
            >
                <svg width="22" height="22" viewBox="0 0 22 22" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="11" cy="11" r="9" fill="none" stroke="#e5e7eb" strokeWidth="2.5"/>
                    <circle
                        cx="11" cy="11" r="9"
                        fill="none"
                        stroke={c.ring}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="57"
                        strokeDashoffset="0"
                        style={{ animation: 'toastCountdown 3s linear forwards' }}
                    />
                </svg>
                <span style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '9px', color: '#9ca3af',
                }}>✕</span>
            </div>

            {/* Bottom progress bar */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0,
                height: '2px',
                background: c.bar,
                animation: 'toastShrink 3s linear forwards',
            }}/>
        </div>
    );
}