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
var Rule_1 = require("./Rule");
var fs = require("fs");
var path = require("path");
var _a = require('@jlguenego/lexer'), Lexer = _a.Lexer, Group = _a.Group;
// Source code to tokenize.
var str = "";
// declare all the language rules.
var blank = new Rule_1.Rule({
    name: 'blank',
    pattern: /\s+/,
    ignore: true
});
var monolineString = new Rule_1.Rule({
    name: 'monoline string',
    // this regexp contains a negative lookbehind
    pattern: /'[^\n]*?(?<!\\)'/,
    preprocess: true,
    generateTokenAttribute: function (lexeme) {
        return lexeme.substring(1, lexeme.length - 1);
    },
    group: Group.LITTERALS
});
var keywords = Rule_1.Rule.createKeywords(['var', 'int', 'input', 'if', 'elif', 'while']);
var operators = Rule_1.Rule.createGroup(Group.OPERATOR, [
    {
        name: 'equal',
        pattern: '='
    }, {
        name: 'operators',
        pattern: '[\\(\\)\'\!\!=\>\<\,]'
    }
]);
var pontuacao = Rule_1.Rule.createGroup(Group.PONTUACAO, [
    {
        name: 'pontuacao',
        pattern: '[\\\'\;\,\:]'
    },
]);
var ints = new Rule_1.Rule({
    name: 'inteiro',
    pattern: /\b(?<!\.)\d+(?!\.)\b/,
    group: Group.INTS
});
var reais = new Rule_1.Rule({
    name: 'reais',
    pattern: /([0-9]+([.][0-9]*)|[.][0-9]+)/,
    group: Group.REAIS
});
var identifier = new Rule_1.Rule({
    name: 'identifier',
    pattern: /([^= ]+)/,
    group: Group.IDENTIFIER
});
// the order is important. Token are applied from first to last.
var rules = __spreadArray(__spreadArray(__spreadArray(__spreadArray([blank, monolineString], keywords, true), operators, true), pontuacao, true), [ints, reais, identifier], false);
// Do the job.
//const tokenSequence = new Lexer(rules).tokenize(str);
// print the output.
//console.log('tokenSequence: ', tokenSequence);
fs.readFile(path.join(__dirname, "../exemplo.txt"), function (err, data) {
    // if (err) throw err;
    // console.log( data.toString('utf8') );
    var arr = data.toString().replace(/\r\n/g, '\n').split('\n');
    // let line = 0
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var i = arr_1[_i];
        str += i + "\n";
    }
    //str = arr.toString();
    //console.log(str);
    var tokenSequence = new Lexer(rules).tokenize(str);
    console.log("Classe      token      linha      quantidade      (1 coluna(quantidade da classe),2 quantidade de tokens)");
    var palavra_reservada = 0;
    var variaveis = 0;
    var numeros_inteiros = 0;
    var numeros_reais = 0;
    var operadores = 0;
    var pontuacao = 0;
    var total_linhas = arr.length;
    var total_tokens = tokenSequence.length;
    var tokens = [];
    var tokensQuantidade = [];
    var count = 1;
    for (var i = 0; i < tokenSequence.length; i++) {
        var tokenExiste = false;
        for (var j = 0; j < tokens.length; j++) {
            if (tokens[j].lexeme == tokenSequence[i].lexeme) {
                tokenExiste = true;
                tokensQuantidade[j]++;
            }
        }
        if (tokenExiste == false) {
            tokens.push(tokenSequence[i]);
            tokensQuantidade.push(1);
            if (tokenSequence[i].group == "keywords") {
                palavra_reservada++;
            }
            if (tokenSequence[i].name == "operators") {
                operadores++;
            }
            if (tokenSequence[i].name == "inteiro") {
                numeros_inteiros++;
            }
            if (tokenSequence[i].name == "reais") {
                numeros_reais++;
            }
            if (tokenSequence[i].name == "pontuacao") {
                pontuacao++;
            }
            if (tokenSequence[i].name == "identifier") {
                variaveis++;
            }
        }
    }
    var resultado = [];
    for (var i = 0; i < tokens.length; i++) {
        resultado.push([tokens[i].name, tokens[i].lexeme, tokens[i].position.line, "".concat(tokensQuantidade[i], "/").concat(count++)]);
    }
    console.table(resultado);
    console.log("\n");
    console.log("Classe          Quantidade");
    console.log("palavra reservada: " + palavra_reservada);
    console.log("variaveis: " + variaveis);
    console.log("numeros inteiros: " + numeros_inteiros);
    console.log("numeros reais: " + numeros_reais);
    console.log("operadores: " + operadores);
    console.log("pontuacao: " + pontuacao);
    console.log("\n");
    console.log("total linhas: " + total_linhas);
    console.log("total tokens: " + tokens.length);
});
