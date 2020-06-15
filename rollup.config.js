import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import * as path from 'path';

export default [
  {
    input: 'src/index.tsx',
    external: ['react'],
    plugins: [
      del({ targets: 'dist/*' }),
      typescript({
        typescript: require('typescript'),
      }),
      postcss({
        extract: true,
        modules: true,
        plugins: [],
        extract: path.resolve(`dist/${pkg.name}.css`),
      }),
      copy({
        targets: [
          { src: 'package.json', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
        ],
      }),
      terser(),
    ],
    output: [
      {
        name: pkg.name,
        file: `dist/${pkg.browser}`,
        format: 'umd',
        globals: {
          react: 'react',
        },
      },
      { file: `dist/${pkg.main}`, format: 'cjs' },
      { file: `dist/${pkg.module}`, format: 'es' },
    ],
  },
];
