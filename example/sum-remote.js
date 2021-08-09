(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['father-test'] = factory());
}(this, (function () {
  'use strict';

  var sum = function sum(a, b) {
    return a + b;
  };

  return sum;

})));