// This file is the main entry point for the Jurukur Visi React application. 
// It sets up the Inertia.js app, including page resolution and rendering. 
// The app uses Inertia.js to create a single-page application experience while still leveraging server-side routing and rendering from Laravel. 
// The progress bar configuration is also included to provide visual feedback during page transitions.

import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// Initialize the Inertia.js app with page resolution and rendering configuration.
createInertiaApp({
    title: (title) => `${title} - Jurukur Visi`,

    // Resolve page components dynamically based on the current route, using Vite's glob import to load all page components from the Pages directory.
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),

    // Set up the React app by rendering the resolved page component into the root element.
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4ade80",
    },
});
