import {isJSON, isString, isPromise, isNetworkUrl} from './index';

describe("isJSON test", () => {
  it('isJSON expect {}', () => {
    expect(isJSON({})).toBe(true);
  });

  it('isJSON expect undefined', () => {
    expect(isJSON(undefined)).toBe(false);
  });

  it('isJSON expect null', () => {
    expect(isJSON(null)).toBe(false);
  });

  it('isJSON expect 0', () => {
    expect(isJSON(0)).toBe(false);
  });
});

describe("isString test", () => {
  it('isString expect {}', () => {
    expect(isString({})).toBe(false);
  });

  it('isString expect undefined', () => {
    expect(isString(undefined)).toBe(false);
  });

  it('isString expect null', () => {
    expect(isString(null)).toBe(false);
  });

  it('isString expect ""', () => {
    expect(isString("")).toBe(true);
  });
});

describe("isPromise test", () => {
  it('isPromise expect {}', () => {
    expect(isPromise({})).toBe(false);
  });

  it('isPromise expect Function', () => {
    expect(isPromise(function() {})).toBe(false);
  });

  it('isPromise expect undefined', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
  });

  it('isPromise expect null', () => {
    expect(isPromise(null)).toBe(false);
  });

  it('isPromise expect ""', () => {
    expect(isPromise("")).toBe(false);
  });
});



describe("isNetworkUrl test", () => {
  it('isNetworkUrl expect null', () => {
    expect(isNetworkUrl(null)).toBe(false);
  });

  it('isNetworkUrl expect ""', () => {
    expect(isNetworkUrl("")).toBe(false);
  });

  it('isNetworkUrl expect "//"', () => {
    // 自适应协议
    expect(isNetworkUrl("//www.baidu.com")).toBe(true);
  });

  it('isNetworkUrl expect "http://"', () => {
    expect(isNetworkUrl("http://www.baidu.com")).toBe(true);
  });

  it('isNetworkUrl expect "https://"', () => {
    expect(isNetworkUrl("https://www.baidu.com")).toBe(true);
  });
});


