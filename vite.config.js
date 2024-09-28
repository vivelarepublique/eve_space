import { rmSync } from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron/simple';

export default defineConfig(() => {
    rmSync('dist-electron', { recursive: true, force: true });
    return {
        plugins: [
            vue(),
            electron({
                main: {
                    entry: 'main.js',
                    onstart({ startup }) {
                        if (process.env.VSCODE_DEBUG) {
                            console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
                        } else {
                            startup();
                        }
                    },
                    vite: {
                        build: {
                            outDir: 'dist-electron/main',
                        },
                    },
                },
                // preload: {
                //     // Shortcut of `build.rollupOptions.input`.
                //     // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                //     input: 'electron/preload/index.ts',
                //     vite: {
                //         build: {
                //             sourcemap: sourcemap ? 'inline' : undefined, // #332
                //             minify: isBuild,
                //             outDir: 'dist-electron/preload',
                //             rollupOptions: {
                //                 external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                //             },
                //         },
                //     },
                // },

                // renderer: {},
            }),
        ],
    };
});
