import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: false,
        rollupOptions: {
            input: 'src/main.js',
            output: {
                inlineDynamicImports: true,
                file: pkg.main,
                dir: undefined,
                manualChunks: false,
                assetFileNames: "assets/[name].[ext]",
            }
        }
    }
})