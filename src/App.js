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
// Variável que receberá o código a ser analisado.
var str = "";
// Regra para identificar espaços em branco.
var espacos = new Rule_1.Rule({
    name: 'espacos',
    pattern: /\s+/,
    ignore: true
});
//Regra para identificar comentários.
var comentarios = new Rule_1.Rule({
    name: 'Comentario',
    pattern: /'[^\n]*?(?<!\\)'/,
    preprocess: true,
    generateTokenAttribute: function (lexeme) {
        return lexeme.substring(1, lexeme.length - 1);
    },
    group: Group.LITTERALS
});
// Regra para identificar palavras reservadas.
var palavra_reservada = Rule_1.Rule.createKeywords(['var', 'int', 'input', 'if', 'elif', 'while']);
// Regra para identificar operadores.
var operadores = Rule_1.Rule.createGroup(Group.OPERATOR, [
    {
        name: 'Operador',
        pattern: '[\=\\(\\)\'\!\!=\>\<\,]'
    }
]);
// Regra para identificar pontuação.
var pontuacao = Rule_1.Rule.createGroup(Group.PONTUACAO, [
    {
        name: 'pontuacao',
        pattern: '[\\\'\;\,\:]'
    },
]);
// Regra para identificar números inteiros.
var inteiros = new Rule_1.Rule({
    name: 'inteiro',
    pattern: /\b(?<!\.)\d+(?!\.)\b/,
    group: Group.inteiros
});
// Regra para identificar números reais.
var reais = new Rule_1.Rule({
    name: 'reais',
    pattern: /([0-9]+([.][0-9]*)|[.][0-9]+)/,
    group: Group.REAIS
});
// Regra para identificar variáveis.
var variaveis = new Rule_1.Rule({
    name: 'Variavel',
    pattern: /([^= ]+)/,
    group: Group.variaveis
});
// Conjunto de regras.
var rules = __spreadArray(__spreadArray(__spreadArray(__spreadArray([espacos, comentarios], palavra_reservada, true), operadores, true), pontuacao, true), [inteiros, reais, variaveis], false);
// Função para ler arquivo.
fs.readFile(path.join(__dirname, "../exemplo.txt"), function (err, data) {
    // Converte conteúdo do arquivo para string.
    var arr = data.toString().replace(/\r\n/g, '\n').split('\n');
    // Adiciona quebra de linhas a strings.
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var i = arr_1[_i];
        str += i + "\n";
    }
    // Resolve regras.
    var tokenSequence = new Lexer(rules).tokenize(str);
    console.log("Classe      token      linha      quantidade      (1 coluna(quantidade da classe),2 quantidade de tokens)");
    // Variáveis para guardar valores de contagem.
    var palavra_reservada = 0;
    var variaveis = 0;
    var numeros_inteiros = 0;
    var numeros_reais = 0;
    var operadores = 0;
    var pontuacao = 0;
    var comentario = 0;
    var total_linhas = arr.length;
    var total_tokens = tokenSequence.length;
    var tokens = [];
    var tokensQuantidade = [];
    var count = 1;
    // Calcula e analisa aparições.
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
            if (tokenSequence[i].name == "Operador") {
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
            if (tokenSequence[i].name == "Variavel") {
                variaveis++;
            }
            if (tokenSequence[i].name == "Comentario") {
                comentario++;
            }
        }
    }
    // Variável de estrutura do relatório.
    var resultado = [];
    // Insere conteúdo no relatório.
    for (var i = 0; i < tokens.length; i++) {
        resultado.push([tokens[i].name == tokens[i].lexeme ? "Palavra reservada" : tokens[i].name, tokens[i].lexeme, tokens[i].position.line, "".concat(tokensQuantidade[i], "/").concat(count++)]);
    }
    // Imprime relatório.
    console.table(resultado);
    console.log("\n");
    console.log("Classe          Quantidade");
    console.log("palavra reservada: " + palavra_reservada);
    console.log("variaveis: " + variaveis);
    console.log("numeros inteiros: " + numeros_inteiros);
    console.log("numeros reais: " + numeros_reais);
    console.log("operadores: " + operadores);
    console.log("pontuacao: " + pontuacao);
    console.log("comentarios: " + comentario);
    console.log("\n");
    console.log("total linhas: " + total_linhas);
    console.log("total tokens: " + tokens.length);
});
