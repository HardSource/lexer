"use strict";
exports.__esModule = true;
exports.convertToTokenSequence = exports.mainStage = void 0;
var apply_rule_1 = require("../tools/apply-rule");
var SourceElement_1 = require("../SourceElement");
/**
 * Lexer main stage: rules are applied in order of the rules sequence given in input.
 * This is fast and compliant with most of the rules.
 *
 * But some rules (string, comment) cannot be well processed when nested.
 * Theses rules must be applied in the preprocess stage.
 *
 * @param {State} state
 * @param {Rule[]} rules
 * @returns {TokenSequence}
 */
var mainStage = function (state, rules) {
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        if (!hasSource(state)) {
            break;
        }
        state = applyRule(state, rule);
    }
    return (0, exports.convertToTokenSequence)(state);
};
exports.mainStage = mainStage;
var hasSource = function (state) {
    return state.find(function (elt) { return elt instanceof SourceElement_1.SourceElement; }) !== undefined;
};
var convertToTokenSequence = function (state) {
    return state.map(function (te) {
        if (te instanceof SourceElement_1.SourceElement) {
            throw new Error("Syntax Error (Lexer): '".concat(te.text, "' at line ").concat(te.position.line, " and col ").concat(te.position.col));
        }
        return te;
    });
};
exports.convertToTokenSequence = convertToTokenSequence;
var applyRule = function (state, rule) {
    var result = [];
    for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
        var elt = state_1[_i];
        if (!(elt instanceof SourceElement_1.SourceElement)) {
            result.push(elt);
            continue;
        }
        result.push.apply(result, (0, apply_rule_1.applyRuleOnSourceElement)(elt, rule));
    }
    return result;
};
