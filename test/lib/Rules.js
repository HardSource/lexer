"use strict";
exports.__esModule = true;
exports.indent = exports.identifier = exports.separators = exports.operators = exports.keywords = exports.varX = exports.blank = exports.monolineString = exports.multilineString = exports.monolineComment = exports.multiLineComment = void 0;
var src_1 = require("../../src");
var position_1 = require("../../src/tools/position");
exports.multiLineComment = new src_1.Rule({
    name: 'multiline comment',
    pattern: /[/][*].*?[*][/]/,
    preprocess: true,
    group: src_1.Group.COMMENTS
});
exports.monolineComment = new src_1.Rule({
    name: 'monoline comment',
    pattern: /[/][/].*?\n/,
    preprocess: true,
    generateTokenAttribute: function (lexeme) {
        return lexeme.substring(0, lexeme.length - 1);
    },
    group: src_1.Group.COMMENTS
});
exports.multilineString = new src_1.Rule({
    name: 'multiline string',
    // this regexp contains a negative lookbehind
    pattern: /`.*?(?<!\\)`/,
    preprocess: true,
    generateTokenAttribute: function (lexeme) {
        return lexeme.substring(1, lexeme.length - 1);
    },
    // note that if the multiline string does not take interpolation like in JS/TS.
    group: src_1.Group.LITTERALS
});
exports.monolineString = new src_1.Rule({
    name: 'monoline string',
    // this regexp contains a negative lookbehind
    pattern: /"[^\n]*?(?<!\\)"/,
    preprocess: true,
    generateTokenAttribute: function (lexeme) {
        return lexeme.substring(1, lexeme.length - 1);
    },
    group: src_1.Group.LITTERALS
});
exports.blank = new src_1.Rule({
    name: 'blank',
    pattern: /\s+/,
    ignore: true
});
exports.varX = new src_1.Rule({
    name: 'varx',
    pattern: /(var)(\s+)(\w+)/,
    preprocess: false,
    expand: function (match, position) {
        return [
            {
                name: match[1],
                group: src_1.Group.KEYWORDS,
                attribute: 'var',
                lexeme: 'var',
                position: position
            },
            {
                name: 'variableIdentifier',
                group: src_1.Group.IDENTIFIERS,
                attribute: match[3],
                lexeme: match[3],
                position: (0, position_1.positionAdd)(position, match[1] + match[2])
            },
        ];
    }
});
exports.keywords = src_1.Rule.createKeywords(['var', 'const']);
exports.operators = src_1.Rule.createGroup(src_1.Group.OPERATORS, [
    {
        name: 'equal',
        pattern: '='
    },
]);
exports.separators = src_1.Rule.createGroup(src_1.Group.SEPARATORS, [
    {
        name: 'semi-column',
        pattern: ';'
    },
]);
exports.identifier = new src_1.Rule({
    name: 'identifier',
    pattern: /\w+/,
    group: src_1.Group.IDENTIFIERS
});
exports.indent = new src_1.Rule({
    name: 'indent',
    pattern: /\n( *)/,
    group: src_1.Group.SEPARATORS,
    expand: function (match, position, ctxt) {
        var _a;
        ctxt.level = (_a = ctxt.level) !== null && _a !== void 0 ? _a : 0;
        var spaceNbr = match[1].length;
        var nextLevel = spaceNbr / 2;
        var diff = nextLevel - ctxt.level;
        ctxt.level = nextLevel;
        if (diff > 0) {
            var indentTk = {
                name: 'indent',
                attribute: undefined,
                group: src_1.Group.SEPARATORS,
                lexeme: '',
                position: position
            };
            return new Array(diff).fill(indentTk);
        }
        if (diff < 0) {
            var dedentTk = {
                name: 'dedent',
                attribute: undefined,
                group: src_1.Group.SEPARATORS,
                lexeme: '',
                position: position
            };
            return new Array(-diff).fill(dedentTk);
        }
        // diff === 0
        return [];
    }
});
