import {Rule} from './Rule';
import * as fs from 'fs';
import * as path from 'path';

const {Lexer, Group} = require('@jlguenego/lexer');

// Source code to tokenize.
let str: string = ``;

// declare all the language rules.
const blank = new Rule({
  name: 'blank',
  pattern: /\s+/,
  ignore: true,
});

const monolineString = new Rule({
  name: 'monoline string',
  // this regexp contains a negative lookbehind
  pattern: /'[^\n]*?(?<!\\)'/,
  preprocess: true,
  generateTokenAttribute(lexeme: string) {
    return lexeme.substring(1, lexeme.length - 1);
  },
  group: Group.LITTERALS,
});

const keywords = Rule.createKeywords(['var','int','input','if','elif','while']);

const operators = Rule.createGroup(Group.OPERATOR, [
  {
    name: 'equal',
    pattern: '=',
  },{
    name: 'operators',
    pattern: '[\\(\\)\'\!\!=\>\<\,]',
  }
]);


const pontuacao = Rule.createGroup(Group.PONTUACAO, [
  {
    name: 'pontuacao',
    pattern: '[\\\'\;\,\:]',
  },
]);

const ints = new Rule({
  name: 'inteiro',
  pattern: /\b(?<!\.)\d+(?!\.)\b/,
  group: Group.INTS,
});

const reais = new Rule({
  name: 'reais',
  pattern: /([0-9]+([.][0-9]*)|[.][0-9]+)/,
  group: Group.REAIS,
});

const identifier = new Rule({
  name: 'identifier',
  pattern: /([^= ]+)/,
  group: Group.IDENTIFIER,
});

// the order is important. Token are applied from first to last.
const rules = [blank, monolineString, ...keywords, ...operators, ...pontuacao, ints, reais, identifier];

// Do the job.
//const tokenSequence = new Lexer(rules).tokenize(str);

// print the output.
//console.log('tokenSequence: ', tokenSequence);

fs.readFile(path.join(__dirname, "../exemplo.txt"), (err, data) => {
    // if (err) throw err;
    // console.log( data.toString('utf8') );
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    // let line = 0
    for(let i of arr) {
        str += i + "\n";
    }
    //str = arr.toString();
    //console.log(str);
    let tokenSequence = new Lexer(rules).tokenize(str);

    console.log("Classe      token      linha      quantidade      (1 coluna(quantidade da classe),2 quantidade de tokens)");
    let palavra_reservada=0;
    let variaveis=0;
    let numeros_inteiros=0;
    let numeros_reais=0;
    let operadores=0;
    let pontuacao=0;

    let total_linhas=arr.length;
    let total_tokens=tokenSequence.length;

    let tokens = [];
    let tokensQuantidade: Array<number> = [];
    let count = 1;
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
        if(tokenSequence[i].name == "operators"){
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
        if(tokenSequence[i].name == "identifier"){
          variaveis++;
        }
      }
    }
    let resultado = [];

    for (let i = 0; i < tokens.length; i++){
      resultado.push([tokens[i].name, tokens[i].lexeme, tokens[i].position.line, `${tokensQuantidade[i]}/${count++}`])
    }
    console.table(resultado);
    console.log("\n");
    console.log("Classe          Quantidade");
    console.log("palavra reservada: "+palavra_reservada);
    console.log("variaveis: "+variaveis);
    console.log("numeros inteiros: "+numeros_inteiros);
    console.log("numeros reais: "+numeros_reais);
    console.log("operadores: "+operadores);
    console.log("pontuacao: "+pontuacao);
    console.log("\n");
    console.log("total linhas: "+total_linhas);
    console.log("total tokens: "+tokens.length);
})
