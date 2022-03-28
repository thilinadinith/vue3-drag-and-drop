import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
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