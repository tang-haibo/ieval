declare module '*.json' {
  interface Package {
    [prop: string]: Package | string;
  }
  export default value;
}
declare module 'jsdom';
declare module 'rollup-plugin-uglify';
declare module 'rollup-plugin-typescript';