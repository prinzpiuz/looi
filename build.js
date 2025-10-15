/* eslint-disable no-undef */
import esbuild from 'esbuild';

const common = {
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true,
    minify: false,
};

esbuild
    .build({
        ...common,
        entryPoints: ['src/background_workers/background.firefox.ts'],
        outfile: 'public/background.firefox.js',
    })
    .catch(() => process.exit(1));

esbuild
    .build({
        ...common,
        entryPoints: ['src/background_workers/background.chrome.ts'],
        outfile: 'public/background.chrome.js',
    })
    .catch(() => process.exit(1));
