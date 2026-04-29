// Tailwind CSS configuration file for the Laravel application. This file defines the content sources for Tailwind to scan for class names, extends the default theme with custom font sizes and line heights, 
// and specifies any plugins to be used with Tailwind CSS. The configuration allows for customization of the design system used in the application while maintaining a consistent and responsive design across different screen sizes.

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {
            fontSize: {
                xs: ["0.8rem", { lineHeight: "1.5" }],
                sm: ["0.9rem", { lineHeight: "1.5" }],
                base: ["1rem", { lineHeight: "1.6" }],
                lg: ["1.125rem", { lineHeight: "1.6" }],
                xl: ["1.25rem", { lineHeight: "1.5" }],
                "2xl": ["1.5rem", { lineHeight: "1.4" }],
                "3xl": ["1.875rem", { lineHeight: "1.3" }],
                "4xl": ["2.25rem", { lineHeight: "1.2" }],
            },
        },
    },
    plugins: [],
};
