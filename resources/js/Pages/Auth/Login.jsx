import { useForm, usePage } from "@inertiajs/react";
import ToastContainer from "../../Components/ToastContainer";
import { useState } from "react";
import { FaHome } from "react-icons/fa";

export default function Login() {
    const { errors = {} } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <ToastContainer />

            {/* Login Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-medium text-green-800 text-center mb-2">
                    JURUKUR VISI
                </h1>
                <h2 className="text-center text-gray-500 mb-8 text-sm">
                    Staff Login
                </h2>

                {/* Login Form */}
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
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Password */}
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
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                tabIndex={-1}
                            >
                                {showPassword ? (
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
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="flex justify-end mt-6 text-sm">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:underline"
                    >
                        <FaHome />
                        <span>Back to home</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
