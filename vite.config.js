import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
const { resolve } = require('path')
import { obfuscator } from 'rollup-obfuscator';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: false,
        rollupOptions: {
            plugins: [
                obfuscator({
                    transformObjectKeys: true,
                    unicodeEscapeSequence: true,
                    numbersToExpressions: true,
                    shuffleStringArray: true,
                    splitStrings: true,
                    stringArrayThreshold: 1,
                    identifierNamesGenerator: 'hexadecimal'
                })
            ],
            output: {
                inlineDynamicImports: false,
                dir: 'dist',
                manualChunks: false,
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    }
})