import typescript from '@rollup/plugin-typescript';
import { minify } from 'rollup-plugin-esbuild-minify';


export default {
    input: 'src/stub.ts',
    output: {
        file: 'dist/stub.js',
        format: 'es'
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
        }),
        minify()
    ],
}
