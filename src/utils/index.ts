export function isJSON<T>(value: T) {
  if (value && typeof value === 'object' && value !== null) {
    return true;
  }
  return false;
}
export function isString<T>(value: T) {
  return typeof value == 'string';
}
export function isPromise<T>(value: T) {
  return value && Object.prototype.toString.call(value) === "[object Promise]" || false;
}

export function isNetworkUrl<T>(value: T) {
  if(!isString(value)) {
    return false;
  }
  return /^(https?\:)?\/\//.test(String(value));
}