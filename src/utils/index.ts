export function isJSON<T>(value: T) {
  if (value && typeof value === 'object' && value !== null) {
    return true;
  }
}
export function isString<T>(value: T) {
  return typeof value == 'string';
}
export function isPromise<T>(value: T) {
  return value && Object.prototype.toString.call(value) === "[object Promise]";
}

export function isAst<T>(value: T) {
  if(!isJSON(value)) {
    return false;
  }
  if((value as unknown as ScriptEmtryAst).type === 'Program') {
    return true;
  }
  return false;
}

export function isNetworkUrl<T>(value: T) {
  if(!isString(value)) {
    return false;
  }
  return /^(https?\:)?\/\//.test(String(value));
}