import esbuild from 'esbuild';

const target = process.argv[2];

if (!target || !['chrome', 'firefox'].includes(target)) {
    console.error('❌ Usage: node build.js <chrome|firefox>');
    process.exit(1);
}

const common = {
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true,
    minify: true,
};

// Map targets to their entry/output
const builds = {
    chrome: {
        entryPoints: ['src/background_workers/background.chrome.ts'],
        outfile: 'public/background.js',
    },
    firefox: {
        entryPoints: ['src/background_workers/background.firefox.ts'],
        outfile: 'public/background.js',
    },
};

(async () => {
    try {
        const { entryPoints, outfile } = builds[target];
        console.log(`🚀 Building ${target} background worker...`);
        await esbuild.build({ ...common, entryPoints, outfile });
        console.log(`✅ Successfully built ${outfile}`);
    } catch (err) {
        console.error(`❌ Build failed for ${target}:`, err);
        process.exit(1);
    }
})();
