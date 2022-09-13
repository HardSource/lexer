"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Rule = void 0;
var Group_1 = require("./Group");
/**
 * Rules are applied on the source code, during tokenization, in order to produces token instances.
 * A Language definition is determined by a sequence of rules.
 *
 * @export
 * @class Rule
 */
var Rule = /** @class */ (function () {
    function Rule(spec) {
        var _this = this;
        this.name = '';
        this.pattern = '';
        this.ignore = false;
        this.group = Group_1.Group.NONE;
        this.preprocess = false;
        this.generateTokenAttribute = function (lexeme) { return lexeme; };
        this.expand = function (match, position) {
            if (_this.ignore) {
                return [];
            }
            return [
                {
                    name: _this.name,
                    lexeme: match[0],
                    group: _this.group,
                    position: position,
                    attribute: _this.generateTokenAttribute(match[0])
                },
            ];
        };
        Object.assign(this, spec);
    }
    Rule.createKeywords = function (array) {
        // longest keyword must be applied first, so we sort the array
        // (maximal munch algorithm, also called longest match)
        return __spreadArray([], array, true).sort(function (a, b) { return b.length - a.length; })
            .map(function (str) {
            return new Rule({
                name: str,
                pattern: new RegExp(str),
                group: Group_1.Group.KEYWORDS
            });
        });
    };
    Rule.createGroup = function (group, array) {
        return array.map(function (spec) { return new Rule(__assign({ group: group }, spec)); });
    };
    return Rule;
}());
exports.Rule = Rule;
