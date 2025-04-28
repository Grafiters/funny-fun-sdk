import { defineConfig } from 'rolldown';

export default defineConfig({
    input: 'src/index.js',  // entry point kamu (file js)
    external: [
        'child_process', 
        'mime-detect'  // tambahkan kalau perlu
    ],
    output: [
        {
            format: 'esm', // <-- pindah ke output array
            entryFileNames: 'index.js',
            minify: true,
            sourcemap: true,
        },
        {
            format: 'cjs',
            entryFileNames: 'index.cjs',
            minify: true,
            sourcemap: true
        }
    ]
});
