"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getNextState = exports.preprocessorStage = void 0;
var apply_rule_1 = require("../tools/apply-rule");
var SourceElement_1 = require("../SourceElement");
/**
 * lexer preprocess stage - rules are all applied according a cursor going
 * from the beginning to the end of the source code.
 *
 * Warning: slow method.
 * To be used for rules that cannot be well applied in the lexer main stage.
 *
 * @param {State} initialState
 * @param {Rule[]} rules
 * @returns {State}
 */
var preprocessorStage = function (initialState, rules) {
    var previousState = [];
    var state = initialState;
    while (state !== previousState) {
        previousState = state;
        state = (0, exports.getNextState)(previousState, rules);
    }
    return state;
};
exports.preprocessorStage = preprocessorStage;
var getPrefixLength = function (r) {
    return r[0] instanceof SourceElement_1.SourceElement ? r[0].text.length : 0;
};
var getNextState = function (state, rules) {
    var sourceElt = state[state.length - 1];
    // if no more source code to preprocess then end the preprocess phase
    // by returning the same state.
    if (!(sourceElt instanceof SourceElement_1.SourceElement)) {
        return state;
    }
    var suffixState = rules
        .map(function (rule) { return (0, apply_rule_1.applyRuleOnSourceElement)(sourceElt, rule, false); })
        .reduce(function (acc, r) {
        // find the minimum size of the prefix
        return getPrefixLength(r) < getPrefixLength(acc) ? r : acc;
    }, [sourceElt]);
    // if no rule where applied, return identical state (to end of preprocess phase).
    if (suffixState[0] === sourceElt) {
        return state;
    }
    // replace the last source element with the suffixState content.
    return __spreadArray(__spreadArray([], state.slice(0, -1), true), suffixState, true);
};
exports.getNextState = getNextState;
