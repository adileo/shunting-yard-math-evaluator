const SYParser = require('./SYParser');
const PNEvaluator = require('./PNEvaluator');

//3 + 4 * 2/(1-5) ^ 2 ^ 3
//sin(max(2,3)/3*3.1415)
var options = {
  funcs: {
    'max': {},
    'min': {},
    'sin': {},
    'cos': {},
    'abs': {},
    'sqrt': {},
    'rand': {},
  },
  replace_default_funcs: false,

  operators: {
    '^': {precedence: 4, associativity: 'right'},
    '*': {precedence: 3, associativity: 'left'},
    '/': {precedence: 3, associativity: 'left'},
    '%': {precedence: 3, associativity: 'left'},
    '+': {precedence: 2, associativity: 'left'},
    '-': {precedence: 2, associativity: 'left'},
  },
  replace_default_operators: false,

  debug: false,
};

console.log("Input: ")
//var input = '3cos(2x) + lan * 2ab + n2e / n12mm + 22ab + gm12a + n2 + ngcos(2)'
var input = '3cos(2x) + lan * 2ab + n2e / n12mm + 22ab + gm12a + n2 + ngcos(2)'
console.log(input + '\n')
var syp = new SYParser(input, function(err, output, used_variables){
  if(err.length > 0){
    console.log(err);
  }else{
    console.log("Output: ")
    console.log(output + '\n');
    console.log("Used variables: ")
    console.log(used_variables);

    var pne = new PNEvaluator(output, function(errors, result){
      if(errors.length > 0){
        console.log(errors)
      }else{
        console.log("Evaluated: ")
        console.log(result)
      }
    }, {'x': 3,'y':Math.PI});

  }
}, options);
