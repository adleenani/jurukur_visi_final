import { useForm, usePage } from "@inertiajs/react";

export default function TwoFactor() {
    const { errors = {} } = usePage().props;
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/2fa");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-medium text-green-800 text-center mb-2">
                    JURUKUR VISI
                </h1>
                <h2 className="text-center text-gray-500 mb-2 text-sm">
                    Two-Factor Verification
                </h2>
                <p className="text-center text-xs text-gray-400 mb-8">
                    Enter the 6-digit code sent to your email
                </p>

                {errors.code && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {errors.code}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <input
                        type="text"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-green-500"
                        placeholder="000000"
                        maxLength={6}
                        required
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-gray-400">
                    Didn't get the code?{" "}
                    <a href="/login" className="text-green-700 hover:underline">
                        Try logging in again
                    </a>
                </p>
            </div>
        </div>
    );
}
