import {Scope} from './scope';


const child = {};
const parent = new Scope({}, null);
const key = Symbol('key');

describe('[Scope]', () => {
  const scope = new Scope(child, parent, key);
  it('Scope Data', () => {
    expect(scope.data).toBe(child);
  });
});