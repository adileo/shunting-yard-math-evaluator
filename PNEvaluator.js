/**
 * PNEvaluator - Evaluate a postfix notation math expression
 * @author Adileo Barone <adileo@barone.tech>
 *
 * @example
 * //returns: 4
 * new PNEvaluator('2 x +', function(errs, output){
 *  if(errs.length > 0){
 *    console.log(errs)
 *  }else{
 *    console.log(output)
 *  }
 * }, {x:2})
 * @example <caption>Available math functions</caption>
 {
     'abs': function(x) {return Math.abs(x)},
     'cos': function(x) {return Math.cos(x)},
     'exp': function(x) {return Math.exp(x)},
     'log': function(x) {return Math.log(x)},
     'sin': function(x) {return Math.sin(x)},
     'pow': function(x,y) {return Math.pow(x,y)},
     'tan': function(x) {return Math.tan(x)},
     'acos': function(x) {return Math.acos(x)},
     'asin': function(x) {return Math.asin(x)},
     'atan': function(x) {return Math.atan(x)},
     'cbrt': function(x) {return Math.cbrt(x)},
     'ceil': function(x) {return Math.ceil(x)},
     'cosh': function(x) {return Math.cosh(x)},
     'imul': function(x,y) {return Math.imul(x,y)},
     'log2': function(x) {return Math.log2(x)},
     'sign': function(x) {return Math.sign(x)},
     'sinh': function(x) {return Math.sinh(x)},
     'sqrt': function(x) {return Math.sqrt(x)},
     'tanh': function(x) {return Math.tanh(x)},
     'acosh': function(x) {return Math.acosh(x)},
     'asinh': function(x) {return Math.asinh(x)},
     'atan2': function(x) {return Math.atan2(x)},
     'atanh': function(x) {return Math.atanh(x)},
     'clz32': function(x) {return Math.clz32(x)},
     'expm1': function(x) {return Math.expm1(x)},
     'floor': function(x) {return Math.floor(x)},
     'log10': function(x) {return Math.log10(x)},
     'log1p': function(x) {return Math.log1p(x)},
     'round': function(x) {return Math.round(x)},
     'trunc': function(x) {return Math.trunc(x)},
     'fround': function(x) {return Math.fround(x)},
     'random': function() {return Math.random()},
     'max': function(x,y) {if(x>y){return x;}else{return y;}},
     'min': function(x,y) {if(x<y){return x;}else{return y;}},
     '/': function(x,y) {return x/y},
     '*': function(x,y) {return x*y},
     '+': function(x,y) {return x+y},
     '-': function(x,y) {return x-y},
     '^': function(x,y) {return Math.pow(x,y)},
     '%': function(x,y) {return x % y},
 }
 * @constructor
 * @param  {string} string - math expression specified in postfix notation
 * @param  {PNEvaluator~evaluateCallback} callback - called when expression is evaluated
 * @param  {PNEvaluator~Variables} variables - values of variables in the expression
 * @param  {PNEvaluator~Options} options - configs
 *
 */
function PNEvaluator(string, callback, variables = {}, options = null) {
    this.variables = variables
    this.funcs = {
        'abs': function(x) {return Math.abs(x)},
        'cos': function(x) {return Math.cos(x)},
        'exp': function(x) {return Math.exp(x)},
        'log': function(x) {return Math.log(x)},
        'sin': function(x) {return Math.sin(x)},
        'pow': function(x,y) {return Math.pow(x,y)},
        'tan': function(x) {return Math.tan(x)},
        'acos': function(x) {return Math.acos(x)},
        'asin': function(x) {return Math.asin(x)},
        'atan': function(x) {return Math.atan(x)},
        'cbrt': function(x) {return Math.cbrt(x)},
        'ceil': function(x) {return Math.ceil(x)},
        'cosh': function(x) {return Math.cosh(x)},
        'imul': function(x,y) {return Math.imul(x,y)},
        'log2': function(x) {return Math.log2(x)},
        'sign': function(x) {return Math.sign(x)},
        'sinh': function(x) {return Math.sinh(x)},
        'sqrt': function(x) {return Math.sqrt(x)},
        'tanh': function(x) {return Math.tanh(x)},
        'acosh': function(x) {return Math.acosh(x)},
        'asinh': function(x) {return Math.asinh(x)},
        'atan2': function(x) {return Math.atan2(x)},
        'atanh': function(x) {return Math.atanh(x)},
        'clz32': function(x) {return Math.clz32(x)},
        'expm1': function(x) {return Math.expm1(x)},
        'floor': function(x) {return Math.floor(x)},
        'log10': function(x) {return Math.log10(x)},
        'log1p': function(x) {return Math.log1p(x)},
        'round': function(x) {return Math.round(x)},
        'trunc': function(x) {return Math.trunc(x)},
        'fround': function(x) {return Math.fround(x)},
        'random': function() {return Math.random()},
        'max': function(x,y) {if(x>y){return x;}else{return y;}},
        'min': function(x,y) {if(x<y){return x;}else{return y;}},
        '/': function(x,y) {return x/y},
        '*': function(x,y) {return x*y},
        '+': function(x,y) {return x+y},
        '-': function(x,y) {return x-y},
        '^': function(x,y) {return Math.pow(x,y)},
        '%': function(x,y) {return x % y},
    }
    this.stack = []
    this.errors = []
    this.debug = false
    if(options){
      if(options.debug && options.debug == true){
        this.debug = true
      }
    }
    var s = string.split(' ')
    for (t in s) {
        var tok = s[t]
        if(this.debug) console.log(this.stack)
        if (this.funcs.hasOwnProperty(tok)) {
            //It's a function token
            var n_args = this.funcs[tok].length
            var args = []
            for (var i = 0; i < this.funcs[tok].length; i++){
              args.push(this.stack.pop())
            }
            args = args.reverse()
            var res = this.funcs[tok].apply(this, args)
            this.stack.push(res)
        } else if (tok.match(/[a-zA-Z]{1}[0-9]*/)) {
            //It's a variable token
            if(this.variables.hasOwnProperty(tok)){
              this.stack.push(this.variables[tok])
            }else{
              if(this.debug) console.log('unknown variable value')
              this.errors.push('Unknown variable value')
            }
        } else if (parseFloat(tok)) {
            var n = parseFloat(tok)
            this.stack.push(n)
        } else {
            if(this.debug) console.log('not recognized')
            this.errors.push('Item not recognized')
        }

    }
    if(this.debug) console.log(this.stack)
    if(this.stack.length != 1){
      this.errors.push('Wrong expression')
      callback(this.errors)
    }else{
    callback(this.errors, this.stack)
    }
}

module.exports = PNEvaluator;
