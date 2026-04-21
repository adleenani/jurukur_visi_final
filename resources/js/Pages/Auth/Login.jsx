import { useForm, usePage } from "@inertiajs/react";
import ToastContainer from "../../Components/ToastContainer";

export default function Login() {
    const { errors = {} } = usePage().props;
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
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-medium text-green-800 text-center mb-2">
                    JURUKUR VISI
                </h1>
                <h2 className="text-center text-gray-500 mb-8 text-sm">
                    Staff Login
                </h2>

                {errors.username && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {errors.username}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
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
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {processing ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="flex justify-between mt-6 text-sm">
                    <a
                        href="/signup"
                        className="text-green-700 hover:underline"
                    >
                        Create account
                    </a>
                    <a href="/" className="text-gray-400 hover:underline">
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}
