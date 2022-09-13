"use strict";
exports.__esModule = true;
exports.Group = void 0;
/**
 * Rule Group
 *
 * Language are not all the same but they often have similar concepts:
 * - keywords
 * - operators
 * - separators (delimiter, {}, [], etc.), also called ponctuators
 * - identifiers
 * - litterals
 * - comments
 *
 * @export
 * @enum {number}
 */
var Group;
(function (Group) {
    Group["NONE"] = "";
    Group["KEYWORDS"] = "keywords";
    Group["SEPARATORS"] = "separators";
    Group["OPERATORS"] = "operators";
    Group["IDENTIFIERS"] = "identifiers";
    Group["LITTERALS"] = "litterals";
    Group["COMMENTS"] = "comments";
})(Group = exports.Group || (exports.Group = {}));
