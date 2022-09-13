"use strict";
exports.__esModule = true;
exports.applyRuleOnSourceElement = void 0;
var SourceElement_1 = require("../SourceElement");
var position_1 = require("./position");
/**
 * Apply a rule on a source element.
 *
 * @param {SourceElement} elt
 * @param {Rule} rule
 * @param {boolean} [matchAll=true] if false, match the rule only once
 * @returns {State} An array of source fragment and token
 */
var applyRuleOnSourceElement = function (elt, rule, matchAll) {
    if (matchAll === void 0) { matchAll = true; }
    // remove empty line from tokenize.
    if (elt.text.length === 0) {
        return [];
    }
    // building a new Regexp makes the old flags completely ignored.
    var matched = elt.text.match(new RegExp(rule.pattern, 's'));
    if (!matched) {
        return [elt];
    }
    return applyMatchOnSourceElement(elt, rule, matched, matchAll);
};
exports.applyRuleOnSourceElement = applyRuleOnSourceElement;
var ctxt = {};
/**
 * Generate a state = [prefixSourceElt?, token, suffixSourceElt?].
 * prefix and suffix are omitted if their text is empty.
 *
 * If matchAll then use recursivity to apply the rule everywhere it is possible in the source element.
 * The output state = [se1, token, se2, token, se3, token, se4, ...]
 *
 * @param {SourceElement} elt
 * @param {Rule} rule
 * @param {RegExpMatchArray} matched
 * @param {boolean} matchAll
 * @returns {State}
 */
var applyMatchOnSourceElement = function (elt, rule, matched, matchAll) {
    /* istanbul ignore if */
    if (matched.index === undefined) {
        // Typescript unfortunately has typings approximation
        throw new Error('When matched exists, index is always present. You should not see this.');
    }
    var prefixText = elt.text.substr(0, matched.index);
    var suffixText = elt.text.substr(matched.index + matched[0].length);
    var startPos = elt.position;
    var matchPos = (0, position_1.positionAdd)(startPos, prefixText);
    var suffixPos = (0, position_1.positionAdd)(matchPos, matched[0]);
    var state = [];
    if (prefixText.length > 0) {
        state.push(new SourceElement_1.SourceElement(prefixText, startPos));
    }
    state.push.apply(state, rule.expand(matched, matchPos, ctxt));
    if (suffixText.length > 0) {
        var se = new SourceElement_1.SourceElement(suffixText, suffixPos);
        var array = matchAll ? (0, exports.applyRuleOnSourceElement)(se, rule) : [se];
        state.push.apply(state, array);
    }
    return state;
};
