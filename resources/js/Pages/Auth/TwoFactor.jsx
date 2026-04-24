import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ToastContainer from '../../Components/ToastContainer';

export default function TwoFactor() {
    const { errors = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(600); // 10 minutes
    const { data, setData, post, processing } = useForm({ code: '' });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    function submit(e) {
        e.preventDefault();
        post('/2fa');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">

                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#d1fae5' }}
                    >
                        <svg width="28" height="28" fill="none" stroke="#15803d" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Check your email</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        We sent a 6-digit verification code to your registered email address.
                    </p>
                </div>

                {/* Error */}
                {errors.code && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {errors.code}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2 text-center">
                            Enter your 6-digit code
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={e => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-widest focus:outline-none focus:border-green-500"
                            placeholder="000000"
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>

                    {/* Countdown timer */}
                    <div className="text-center">
                        {countdown > 0 ? (
                            <p className="text-sm text-gray-400">
                                Code expires in{' '}
                                <span className={`font-bold ${countdown < 60 ? 'text-red-500' : 'text-green-600'}`}>
                                    {minutes}:{String(seconds).padStart(2, '0')}
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-red-500 font-medium">
                                Code expired. Please login again.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || countdown === 0 || data.code.length < 6}
                        className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                {/* Links */}
                <div className="flex justify-between mt-6 text-sm">
                    <a href="/login" className="text-gray-400 hover:text-green-700 transition">
                        ← Back to login
                    </a>
                    <a href="/login" className="text-green-700 hover:underline">
                        Try again
                    </a>
                </div>
            </div>
        </div>
    );
}