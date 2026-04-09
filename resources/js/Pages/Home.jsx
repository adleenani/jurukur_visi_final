import Navbar from "../Components/Navbar";
import { Link } from "@inertiajs/react";

const services = [
    {
        title: "Cadastral Survey",
        desc: "Precise boundary surveys for land ownership and title registration.",
    },
    {
        title: "Topographic Mapping",
        desc: "Detailed mapping of terrain features for planning and development.",
    },
    {
        title: "Engineering Survey",
        desc: "Construction and infrastructure surveys for engineering projects.",
    },
    {
        title: "Strata Title",
        desc: "Strata title surveys for multi-storey buildings and developments.",
    },
    {
        title: "GPS Survey",
        desc: "High-precision GPS positioning for large-scale mapping projects.",
    },
    {
        title: "Underground Utilities",
        desc: "Detection and mapping of underground utility networks.",
    },
];

export default function Home({ stats }) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="bg-green-800 text-white py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-medium mb-4">
                        Professional Surveying & Mapping
                    </h1>
                    <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
                        Jurukur Visi Sdn Bhd — a Bumiputera-owned consultancy
                        delivering precision surveying solutions across Malaysia
                        since 2005.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/projects"
                            className="bg-white text-green-800 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition"
                        >
                            View Projects
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                        >
                            Book Consultation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-green-700 text-white py-10 px-6">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <div className="text-center">
                        <div className="text-4xl font-medium">
                            {stats?.projects ?? 0}
                        </div>
                        <div className="text-green-200 text-sm mt-1">
                            Projects Completed
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-medium text-green-800 mb-4">
                            About Jurukur Visi
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Based in Sungai Buloh, Selangor, we specialise in
                            advanced mapping and surveying solutions for
                            government and private sector clients across
                            Malaysia.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            With over 12 years of experience, our licensed
                            surveyors bring precision, professionalism and deep
                            local expertise to every project.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Years Experience", value: "12+" },
                            { label: "Licensed Surveyors", value: "10+" },
                            { label: "Satisfied Clients", value: "100%" },
                            { label: "States Covered", value: "All MY" },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="bg-green-50 rounded-xl p-5 text-center"
                            >
                                <div className="text-2xl font-medium text-green-800">
                                    {value}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-medium text-green-800 text-center mb-12">
                        Our Services
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map(({ title, desc }) => (
                            <div
                                key={title}
                                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-sm transition"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                                </div>
                                <h3 className="font-medium text-green-800 mb-2">
                                    {title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-green-800 text-white text-center">
                <h2 className="text-3xl font-medium mb-4">
                    Ready to start your project?
                </h2>
                <p className="text-green-200 mb-8">
                    Book a consultation and get a project quote from our team.
                </p>
                <Link
                    href="/contact"
                    className="bg-white text-green-800 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition"
                >
                    Book Consultation
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
                <p>
                    © {new Date().getFullYear()} Jurukur Visi Sdn Bhd · Sungai
                    Buloh, Selangor
                </p>
                <p className="mt-1">
                    Tel: +603 1234 5678 · info@jurukurvisi.com
                </p>
            </footer>
        </div>
    );
}
