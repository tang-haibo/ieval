import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import pkg from '../package.json';

const plugins = [
  resolve(),
  commonjs(),
  typescript(),
  json(),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: `${pkg.main}/index.js`,
      name: 'iEval',
      format: 'umd',
    },
    plugins
  }
]; 
