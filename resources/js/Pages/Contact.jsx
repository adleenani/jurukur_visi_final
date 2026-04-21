import Navbar from "../Components/Navbar";
import { useForm, usePage } from "@inertiajs/react";
import PublicLayout from "../Layout/PublicLayout";

const services = [
    "Consultant and Survey Services in Cadastral",
    "Strata Title",
    "Topographic Hydrographic",
    "Engineering and Mapping",
    "Mining",
    "Aerial",
    "M.Tech",
    "GPS",
    "Land & Housing Development",
    "Underground Utilities Detection and Mapping",
];

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
];

export default function Contact() {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        service_type: "",
        preferred_date: "",
        preferred_time: "",
        consultation_type: "online",
        message: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/contact", { onSuccess: () => reset() });
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <h1 className="text-3xl font-medium text-green-800 mb-2">
                        Book a Consultation
                    </h1>
                    <p className="text-gray-500 mb-10 text-sm">
                        Fill in the form below and our team will confirm your
                        appointment within 1–2 business days.
                    </p>

                    {flash.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl mb-8 text-sm">
                            {flash.success}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="bg-white rounded-xl border border-gray-100 p-8 space-y-6"
                    >
                        {/* Personal Info */}
                        <div>
                            <h2 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
                                Personal Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="Your full name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="+60 12 345 6789"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Consultation Details */}
                        <div>
                            <h2 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
                                Consultation Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Service Required
                                    </label>
                                    <select
                                        value={data.service_type}
                                        onChange={(e) =>
                                            setData(
                                                "service_type",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        required
                                    >
                                        <option value="">
                                            -- Select a service --
                                        </option>
                                        {services.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.service_type && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.service_type}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.preferred_date}
                                            onChange={(e) =>
                                                setData(
                                                    "preferred_date",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                            required
                                        />
                                        {errors.preferred_date && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.preferred_date}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Preferred Time
                                        </label>
                                        <select
                                            value={data.preferred_time}
                                            onChange={(e) =>
                                                setData(
                                                    "preferred_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                            required
                                        >
                                            <option value="">
                                                -- Select a time --
                                            </option>
                                            {timeSlots.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.preferred_time && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.preferred_time}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        Consultation Type
                                    </label>
                                    <div className="flex gap-4">
                                        {["online", "in-person"].map((type) => (
                                            <label
                                                key={type}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    value={type}
                                                    checked={
                                                        data.consultation_type ===
                                                        type
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "consultation_type",
                                                            type,
                                                        )
                                                    }
                                                    className="accent-green-700"
                                                />
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Additional Message (optional)
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        rows={4}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                                        placeholder="Tell us more about your project or requirements..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-700 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {processing
                                ? "Submitting..."
                                : "Submit Booking Request"}
                        </button>
                    </form>

                    {/* Contact info */}
                    <div className="mt-10 grid md:grid-cols-3 gap-6 text-center text-sm text-gray-500">
                        {[
                            {
                                label: "Address",
                                value: "Sungai Buloh, Selangor",
                            },
                            { label: "Phone", value: "+603 1234 5678" },
                            { label: "Email", value: "info@jurukurvisi.com" },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="bg-white rounded-xl p-4 border border-gray-100"
                            >
                                <p className="text-xs text-gray-400 mb-1">
                                    {label}
                                </p>
                                <p className="text-gray-700 font-medium">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
