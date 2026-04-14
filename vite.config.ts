import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tsconfigPaths()],
        resolve: {
            alias: [
                { find: '@', replacement: resolve(__dirname, 'src') },
                { find: '@context', replacement: resolve(__dirname, 'src', 'context') },
                { find: '@pages', replacement: resolve(__dirname, 'src', 'pages') },
                { find: '@shared', replacement: resolve(__dirname, 'src', 'shared') },
                { find: '@ui', replacement: resolve(__dirname, 'src', 'components', 'ui') },
                { find: '@public', replacement: resolve(__dirname, './public') },
                { find: '@components', replacement: resolve(__dirname, 'src', 'components') },
                { find: '@theme', replacement: resolve(__dirname, 'src', 'theme', 'recipes') },
            ],
        },
    };
});
