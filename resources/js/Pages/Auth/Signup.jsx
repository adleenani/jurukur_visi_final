import { useForm } from '@inertiajs/react';

export default function Signup({ errors }) {
    const { data, setData, post, processing } = useForm({
        username: '',
        full_name: '',
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/signup');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-medium text-green-800 text-center mb-2">JURUKUR VISI</h1>
                <h2 className="text-center text-gray-500 mb-8 text-sm">Create Staff Account</h2>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm space-y-1">
                        {Object.values(errors).map((e, i) => <p key={i}>{e}</p>)}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {[
                        { label: 'Username', key: 'username', type: 'text', hint: '4–30 characters' },
                        { label: 'Full Name', key: 'full_name', type: 'text', hint: '' },
                        { label: 'Email Address', key: 'email', type: 'email', hint: '' },
                        { label: 'Password', key: 'password', type: 'password', hint: 'Min 14 chars, 1 uppercase, 1 number' },
                    ].map(({ label, key, type, hint }) => (
                        <div key={key}>
                            <label className="block text-sm text-gray-600 mb-1">{label}</label>
                            <input
                                type={type}
                                value={data[key]}
                                onChange={e => setData(key, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                required
                            />
                            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-400">
                    Already have an account? <a href="/login" className="text-green-700 hover:underline">Log in</a>
                </p>
            </div>
        </div>
    );
}