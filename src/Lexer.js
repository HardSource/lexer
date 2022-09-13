"use strict";
exports.__esModule = true;
exports.Lexer = void 0;
var preprocessor_1 = require("./stages/preprocessor");
var SourceElement_1 = require("./SourceElement");
var main_1 = require("./stages/main");
var Lexer = /** @class */ (function () {
    function Lexer(rules) {
        this.rules = rules.filter(function (t) { return t.preprocess === false; });
        this.preprocessRules = rules.filter(function (t) { return t.preprocess === true; });
    }
    Lexer.prototype.tokenize = function (source) {
        var src = convertToUnixFormat(source);
        var state = (0, preprocessor_1.preprocessorStage)([new SourceElement_1.SourceElement(src, { line: 1, col: 1 })], this.preprocessRules);
        return (0, main_1.mainStage)(state, this.rules);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var convertToUnixFormat = function (s) { return s.replace(/\r\n/g, '\n'); };
