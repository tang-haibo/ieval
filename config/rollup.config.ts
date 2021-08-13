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
      name: String(pkg.name).replace(/\-(\w)/g, (str: string, $1: string) => String($1).toUpperCase()),
      format: 'umd',
    },
    plugins
  }
]; 
