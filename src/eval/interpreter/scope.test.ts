import {Scope} from './scope';


const child = {};
const parent = new Scope({}, null);
const key = Symbol('key');

describe('[Scope]', () => {
  it('Scope Data', () => {
    const scope = new Scope(child, parent, key);
    expect(scope.data).toBe(child);
    expect(scope.parent).toBe(parent);
  });
  it('Scope null', () => {
    const scope = new Scope(child);
    expect(scope.data).toBe(child);
    expect(scope.parent).toBe(null);
  });
});