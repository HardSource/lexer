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
var assert_1 = require("assert");
var index_1 = require("../src/index");
var Rules_1 = require("./lib/Rules");
describe('String Unit Test', function () {
    it('simple string', function () {
        var str = "\nvar x = \"this include double quote \\\".\";\n";
        var rules = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
            Rules_1.multiLineComment,
            Rules_1.monolineComment,
            Rules_1.monolineString,
            Rules_1.blank
        ], Rules_1.keywords, true), Rules_1.operators, true), Rules_1.separators, true), [
            Rules_1.identifier,
        ], false);
        var tokenSequence = new index_1.Lexer(rules).tokenize(str);
        var expectedTokenSequence = [
            {
                name: 'var',
                lexeme: 'var',
                group: 'keywords',
                position: { line: 2, col: 1 },
                attribute: 'var'
            },
            {
                name: 'identifier',
                lexeme: 'x',
                group: 'identifiers',
                position: { line: 2, col: 5 },
                attribute: 'x'
            },
            {
                name: 'equal',
                lexeme: '=',
                group: 'operators',
                position: { line: 2, col: 7 },
                attribute: '='
            },
            {
                name: 'monoline string',
                lexeme: '"this include double quote \\"."',
                group: 'litterals',
                position: { line: 2, col: 9 },
                attribute: 'this include double quote \\".'
            },
            {
                name: 'semi-column',
                lexeme: ';',
                group: 'separators',
                position: { line: 2, col: 40 },
                attribute: ';'
            },
        ];
        assert_1["default"].deepStrictEqual(tokenSequence, expectedTokenSequence);
    });
});
