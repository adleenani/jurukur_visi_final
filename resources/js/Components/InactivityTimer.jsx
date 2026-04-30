import { useEffect, useState, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

const INACTIVE_LIMIT = 5 * 60 * 1000;  // 5 minutes
const WARNING_TIME   = 60 * 1000;       // show warning 1 minute before logout

export default function InactivityTimer() {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown]     = useState(60);
    const timerRef    = useRef(null);
    const countRef    = useRef(null);
    const warningRef  = useRef(false);

    const resetTimer = useCallback(() => {
        if (warningRef.current) return; // don't reset if warning is showing
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            warningRef.current = true;
            setShowWarning(true);
            setCountdown(60);
            startCountdown();
        }, INACTIVE_LIMIT - WARNING_TIME);
    }, []);

    function startCountdown() {
        clearInterval(countRef.current);
        let secs = 60;
        countRef.current = setInterval(() => {
            secs -= 1;
            setCountdown(secs);
            if (secs <= 0) {
                clearInterval(countRef.current);
                logout();
            }
        }, 1000);
    }

    function logout() {
        router.post('/logout');
    }

    function stayLoggedIn() {
        warningRef.current = false;
        setShowWarning(false);
        clearInterval(countRef.current);
        resetTimer();
    }

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(e => window.addEventListener(e, resetTimer));
        resetTimer(); // start initial timer

        return () => {
            events.forEach(e => window.removeEventListener(e, resetTimer));
            clearTimeout(timerRef.current);
            clearInterval(countRef.current);
        };
    }, [resetTimer]);

    if (!showWarning) return null;

    return (
        <>
            {/* Backdrop */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 99998,
                backdropFilter: 'blur(2px)',
            }} />

            {/* Popup */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 99999,
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                width: '380px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                border: '1px solid #e5e7eb',
            }}>
                {/* Icon */}
                <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    background: '#fef9c3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '28px',
                }}>
                    ⏰
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                    Still there?
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, marginBottom: '20px' }}>
                    No activity detected. For your security, you will be automatically logged out in:
                </p>

                {/* Countdown */}
                <div style={{
                    fontSize: '48px', fontWeight: 800,
                    color: countdown <= 10 ? '#dc2626' : '#064e3b',
                    marginBottom: '24px',
                    transition: 'color 0.3s',
                }}>
                    {countdown}s
                </div>

                {/* Progress bar */}
                <div style={{
                    height: '4px', background: '#f3f4f6',
                    borderRadius: '99px', marginBottom: '24px', overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${(countdown / 60) * 100}%`,
                        background: countdown <= 10 ? '#dc2626' : '#15803d',
                        borderRadius: '99px',
                        transition: 'width 1s linear, background 0.3s',
                    }} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={stayLoggedIn}
                        style={{
                            flex: 1, padding: '12px',
                            background: 'linear-gradient(135deg, #064e3b, #065f46)',
                            color: 'white', border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        ✓ Yes, I'm still here
                    </button>
                    <button
                        onClick={logout}
                        style={{
                            flex: 1, padding: '12px',
                            background: '#fef2f2', color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
}