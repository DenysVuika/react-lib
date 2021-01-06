import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import pkg from './package.json';
import { resolve } from 'path';

const peerDependencies = pkg.config.lib.peerDependencies;

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
        modules: true,
        plugins: [],
        extract: resolve(`dist/${pkg.name}.css`),
      }),
      copy({
        targets: [
          { src: 'README.md', dest: 'dist' },
          { src: 'CHANGELOG.md', dest: 'dist' },
        ],
      }),
      generatePackageJson({
        baseContents: (pkg) => ({
          ...pkg,
          name: pkg.name,
          scripts: undefined,
          dependencies: {},
          devDependencies: {},
          peerDependencies,
          private: true,
          config: undefined,
        }),
      }),
      terser(),
    ],
    output: [
      {
        name: pkg.name,
        file: `dist/${pkg.main}`,
        format: 'umd',
        globals: {
          react: 'react',
        },
        sourcemap: true,
      },
      { file: `dist/${pkg.module}`, format: 'es', sourcemap: true },
    ],
  },
];
