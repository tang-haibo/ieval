import {ThrowError, ThrowSyntaxError, ThrowReferenceError, ThrowTypeError, InterruptThrowError, InterruptThrowSyntaxError, } from './messages';

describe('[ThrowError]', () => {
  it('[ThrowError]', () => {
    expect(() => { throw new ThrowError() }).toThrow(Error);
  });
});

describe('[ThrowSyntaxError]', () => {
  it('[ThrowSyntaxError]', () => {
    expect(() => { throw new ThrowSyntaxError() }).toThrow(SyntaxError);
  });
});

describe('[ThrowReferenceError]', () => {
  it('[ThrowReferenceError]', () => {
    expect(() => { throw new ThrowReferenceError() }).toThrow(ReferenceError);
  });
});

describe('[ThrowTypeError]', () => {
  it('[ThrowTypeError]', () => {
    expect(() => { throw new ThrowTypeError() }).toThrow(TypeError);
  });
});

describe('[InterruptThrowError]', () => {
  it('[InterruptThrowError]', () => {
    expect(() => { throw new InterruptThrowError() }).toThrow(Error);
  });
});

describe('[InterruptThrowSyntaxError]', () => {
  it('[InterruptThrowSyntaxError]', () => {
    expect(() => { throw new InterruptThrowSyntaxError() }).toThrow(SyntaxError);
  });
});