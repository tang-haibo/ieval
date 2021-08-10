
interface Console {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
interface RuntimeVars {
  console: Console
}