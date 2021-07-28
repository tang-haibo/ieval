import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

const plugins = [ // 打包插件
  resolve(), // 查找和打包node_modules中的第三方模块
  commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
  typescript() // 解析 TypeScript
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: `${pkg.main}/index.js`,
      name: pkg.name,
      format: 'umd',
    },
    plugins
  },
  {
    input: 'src/parser/index.ts',
    output: {
      file: `${pkg.main}/parser.js`,
      name: pkg.main,
      format: 'umd',
    },
    plugins
  },
  {
    input: 'src/imports/index.ts',
    output: {
      file: `${pkg.main}/imports.js`,
      name: pkg.main,
      format: 'umd',
    },
    plugins
  },
  {
    input: 'src/eval/index.ts',
    output: {
      file: `${pkg.main}/eval.js`,
      name: pkg.main,
      format: 'umd',
    },
    plugins
  },
]; 
