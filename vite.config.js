// Vite configuration file for the Laravel application. This file defines the plugins to be used with Vite, including the Laravel plugin for handling Laravel-specific features and the React plugin for enabling React support in the frontend. 
// The configuration specifies the input files for Vite to process, including the main CSS and JavaScript files, and enables hot module replacement (HMR) for a better development experience. 
// This setup allows for efficient asset management and a seamless integration of frontend technologies with the Laravel backend.

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});