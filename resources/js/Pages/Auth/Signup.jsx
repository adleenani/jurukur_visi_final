import { useForm, usePage } from "@inertiajs/react";
import ToastContainer from "../../Components/ToastContainer";
import { useState } from "react";

export default function Signup() {
    const { errors = {}, flash = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing } = useForm({
        username: "",
        full_name: "",
        email: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/signup");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <ToastContainer />

            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-medium text-green-800 text-center mb-2">
                    JURUKUR VISI
                </h1>
                <h2 className="text-center text-gray-500 mb-8 text-sm">
                    Create Staff Account
                </h2>

                <form onSubmit={submit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            4–30 characters
                        </p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Password with eye toggle */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? (
                                    // Password is visible — show slashed eye to indicate "click to hide"
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                                    </svg>
                                ) : (
                                    // Password is hidden — show open eye to indicate "click to show"
                                    <svg
                                        width="18"
                                        height="18"
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
                        <p className="text-xs text-gray-400 mt-1">
                            Min 14 chars, 1 uppercase, 1 number
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-green-700 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
