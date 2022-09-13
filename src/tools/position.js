"use strict";
exports.__esModule = true;
exports.positionAdd = void 0;
var positionAdd = function (pos, str) {
    var lines = str.split('\n');
    if (lines.length === 1) {
        return { line: pos.line, col: pos.col + str.length };
    }
    return {
        line: pos.line + lines.length - 1,
        col: lines[lines.length - 1].length + 1
    };
};
exports.positionAdd = positionAdd;
