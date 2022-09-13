import {Rule} from './Rule';
import * as fs from 'fs';
import * as path from 'path';

const {Lexer, Group} = require('@jlguenego/lexer');

// Variável que receberá o código a ser analisado.
let str: string = ``;

// Regra para identificar espaços em branco.
const espacos = new Rule({
  name: 'espacos',
  pattern: /\s+/,
  ignore: true,
});

//Regra para identificar comentários.
const comentarios = new Rule({
  name: 'Comentario',
  pattern: /'[^\n]*?(?<!\\)'/,
  preprocess: true,
  generateTokenAttribute(lexeme: string) {
    return lexeme.substring(1, lexeme.length - 1);
  },
  group: Group.LITTERALS,
});

// Regra para identificar palavras reservadas.
const palavra_reservada = Rule.createKeywords(['var','int','input','if','elif','while']);

// Regra para identificar operadores.
const operadores = Rule.createGroup(Group.OPERATOR, [
  {
    name: 'Operador',
    pattern: '[\=\\(\\)\'\!\!=\>\<\,]',
  }
]);

// Regra para identificar pontuação.
const pontuacao = Rule.createGroup(Group.PONTUACAO, [
  {
    name: 'pontuacao',
    pattern: '[\\\'\;\,\:]',
  },
]);

// Regra para identificar números inteiros.
const inteiros = new Rule({
  name: 'inteiro',
  pattern: /\b(?<!\.)\d+(?!\.)\b/,
  group: Group.inteiros,
});

// Regra para identificar números reais.
const reais = new Rule({
  name: 'reais',
  pattern: /([0-9]+([.][0-9]*)|[.][0-9]+)/,
  group: Group.REAIS,
});

// Regra para identificar variáveis.
const variaveis = new Rule({
  name: 'Variavel',
  pattern: /([^= ]+)/,
  group: Group.variaveis,
});

// Conjunto de regras.
const rules = [espacos, comentarios, ...palavra_reservada, ...operadores, ...pontuacao, inteiros, reais, variaveis];

// Função para ler arquivo.
fs.readFile(path.join(__dirname, "../exemplo.txt"), (err, data) => {

  // Converte conteúdo do arquivo para string.
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    
    // Adiciona quebra de linhas a strings.
    for(let i of arr) {
        str += i + "\n";
    }
  
    // Resolve regras.
    let tokenSequence = new Lexer(rules).tokenize(str);

    console.log("Classe      token      linha      quantidade      (1 coluna(quantidade da classe),2 quantidade de tokens)");

    // Variáveis para guardar valores de contagem.
    let palavra_reservada=0;
    let variaveis=0;
    let numeros_inteiros=0;
    let numeros_reais=0;
    let operadores=0;
    let pontuacao=0;
    let comentario=0;

    let total_linhas=arr.length;
    let total_tokens=tokenSequence.length;

    let tokens = [];
    let tokensQuantidade: Array<number> = [];
    let count = 1;
    
    // Calcula e analisa aparições.
    for (let i = 0; i < tokenSequence.length; i++){
      let tokenExiste = false;
      for(var j = 0; j < tokens.length; j++)
      { 
        if(tokens[j].lexeme == tokenSequence[i].lexeme){
          tokenExiste = true;
          tokensQuantidade[j]++;
        }
      }
      if(tokenExiste == false){
        tokens.push(tokenSequence[i]);
        tokensQuantidade.push(1);
        if(tokenSequence[i].group == "keywords"){
          palavra_reservada++;
        }
        if(tokenSequence[i].name == "Operador"){
          operadores++;
        }
        if(tokenSequence[i].name == "inteiro"){
          numeros_inteiros++;
        }
        if(tokenSequence[i].name == "reais"){
          numeros_reais++;
        }
        if(tokenSequence[i].name == "pontuacao"){
          pontuacao++;
        }
        if(tokenSequence[i].name == "Variavel"){
          variaveis++;
        }
        if(tokenSequence[i].name == "Comentario"){
          comentario++;
        }
        }
    }

    // Variável de estrutura do relatório.
    let resultado = [];
    
    // Insere conteúdo no relatório.
    for (let i = 0; i < tokens.length; i++){
      resultado.push([tokens[i].name==tokens[i].lexeme ? "Palavra reservada" : tokens[i].name, tokens[i].lexeme, tokens[i].position.line, `${tokensQuantidade[i]}/${count++}`])
    }

    // Imprime relatório.
    console.table(resultado);
    console.log("\n");
    console.log("Classe          Quantidade");
    console.log("palavra reservada: "+palavra_reservada);
    console.log("variaveis: "+variaveis);
    console.log("numeros inteiros: "+numeros_inteiros);
    console.log("numeros reais: "+numeros_reais);
    console.log("operadores: "+operadores);
    console.log("pontuacao: "+pontuacao);
    console.log("comentarios: "+comentario);
    console.log("\n");
    console.log("total linhas: "+total_linhas);
    console.log("total tokens: "+tokens.length);
})
