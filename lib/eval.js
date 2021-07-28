(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global[''] = global[''] || {}, global['']['/lib/'] = {})));
}(this, (function (exports) { 'use strict';

	// 解释器
	function EvalScript() {
	}

	exports.EvalScript = EvalScript;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
