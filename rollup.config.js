import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import pkg from './package.json';
import * as path from 'path';

const libDependencies = ['react', 'react-dom', 'typescript'];

const peerDependencies = Object.fromEntries(
  Object.keys(pkg.devDependencies)
    .filter((key) => libDependencies.includes(key))
    .map((key) => [key, pkg.devDependencies[key]])
);

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
        targets: [{ src: 'README.md', dest: 'dist' }],
      }),
      generatePackageJson({
        baseContents: (pkg) => ({
          ...pkg,
          name: pkg.name,
          scripts: {},
          dependencies: {},
          devDependencies: {},
          peerDependencies,
          private: true,
        }),
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
