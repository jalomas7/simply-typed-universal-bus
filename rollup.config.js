import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: ['src/stub.ts', 'src/examples/*.ts'],
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [
        multiInput(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
        })
    ],
}
