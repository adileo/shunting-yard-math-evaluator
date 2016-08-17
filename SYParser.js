/**
 * SYParser - Shunting Yard Algorithm implementation
 * @author Adileo Barone <adileo@barone.tech>
 *
 * @example
 * //returns: x 3 max 3 / 3.1415 * sin
 * new SYParser('sin(max(x,3)/3*3.1415)', function(errs, output){
 *  if(errs.length > 0){
 *    console.log(errs)
 *  }else{
 *    console.log(output)
 *  }
 * })
 * @example <caption>How variables are parsed</caption>
 * //Variables = 1 letter + integer(optional)
 * p12en -> p12 * e * n
 * mg -> m * g
 * xz10 -> x * z10
 * @example <caption>Parsed examples</caption>
 * //Input
 * 3cos(2x) + lan * 2ab + n2e / n12mm + 22ab + gm12a + n2 + ngcos(2)
 * //Output
 * 3 2 x * cos * l a * n * 2 * a * b * + n2 e * n12 / m * m * + 22 a * b * + g m12 * a * + n2 + n g * 2 cos * +
 * @constructor
 * @param  {string} string - math expression specified in infix notation
 * @param  {SYParser~parseCallback} callback - called when expression parsing is finished
 * @param  {SYParser~Options} options - configuration object
 *
 */

function SYParser(string, callback, options = null) {
    this.input = string
    this.output = ''
    this.operatorStack = []
    this.errors = []
    this.callback = callback
    this.debug = false
    this.funcs = {
        'abs': {},
        'cos': {},
        'exp': {},
        'log': {},
        'sin': {},
        'pow': {},
        'tan': {},
        'acos': {},
        'asin': {},
        'atan': {},
        'cbrt': {},
        'ceil': {},
        'cosh': {},
        'imul': {},
        'log2': {},
        'sign': {},
        'sinh': {},
        'sqrt': {},
        'tanh': {},
        'acosh': {},
        'asinh': {},
        'atan2': {},
        'atanh': {},
        'clz32': {},
        'expm1': {},
        'floor': {},
        'log10': {},
        'log1p': {},
        'round': {},
        'trunc': {},
        'fround': {},
        'random': {},
        'max': {},
        'min': {},
    };
    this.operators = {
        '^': {
            precedence: 4,
            associativity: 'right'
        },
        '*': {
            precedence: 3,
            associativity: 'left'
        },
        '/': {
            precedence: 3,
            associativity: 'left'
        },
        '%': {
            precedence: 3,
            associativity: 'left'
        },
        '+': {
            precedence: 2,
            associativity: 'left'
        },
        '-': {
            precedence: 2,
            associativity: 'left'
        },
    };

    this.used_variables = {}

    //Set options
    if (options) {
        if (options.funcs) {

            if (options.hasOwnProperty('replace_default_funcs') && options.replace_default_funcs == true) {
                this.funcs = options.funcs
            } else {
                for (var key in options.funcs) {
                    this.funcs[key] = {}
                }
            }
        }
        if (options.operators) {
            if (options.hasOwnProperty('replace_default_operators') && options.replace_default_operators == true) {
                this.operators = options.operators
            } else {
                for (var key in options.operators) {
                    this.operators[key] = options.operators[key]
                }
            }
        }

        if (options.debug == true) {
            this.debug = true
        }
    }
    //Start parsing
    this.parse(string)
}


SYParser.prototype.parse = function(string) {
    //Remove spaces
    var s = string.replace(/ /g, '')

    // 2x -> 2*x
    // 22ab -> 22*ab
    // g12a -> g12a
    s = s.replace(/([a-zA-Z]*)([0-9]+)([a-zA-Z])/g, function(match, m1, m2, m3) {
        if (m1) {
            return match
        } else {
            return m1 + m2 + '*' + m3
        }
    }.bind(this))
    if (this.debug) console.log(s)

    // n2e -> n2*e
    // ma123g -> m*a123*g
    s = s.replace(/([a-zA-Z]?)([a-zA-Z][0-9]+)([a-zA-Z]?)/g, function(match, m1, m2, m3) {
        if (m1 && m3) {
            return m1 + '*' + m2 + '*' + m3
        } else if (m1) {
            return m1 + '*' + m2
        } else if (m3) {
            return m2 + '*' + m3
        } else {
            return match
        }
    }.bind(this))
    if (this.debug) console.log(s)

    // cos -> cos
    // ncos -> n*cos
    // abc -> a*b*c
    // ab -> a*b
    // nncos -> n*n*cos
    s = s.replace(/([a-zA-Z]{2,})/g, function(match) {
        var last = match
        var buf = ''
        while (last.length) {
            if (this.funcs.hasOwnProperty(last)) {
                buf += last
                last = ''
            } else {
                if (last.length > 1) {
                    buf += last[0] + '*'
                    last = last.substr(1)
                } else {
                    buf += last[0]
                    last = ''
                }
            }
        }
        return buf
    }.bind(this))
    if (this.debug) console.log(s)

    /**
     * Split expression by operators and '(', ')', ','
     */
    var spl = ''
    for (k in this.operators) {
        spl += '|\\' + k
    }
    var re = new RegExp("(\\(|\\)|\\," + spl + ")", 'g');
    s = s.split(re)

    if (this.debug) console.log(s)


    //For every token
    while (s.length) {
        //If errors in previous cycle
        if (this.errors.length > 0) {
            break
        }
        if (this.debug) {
            console.log('----------------');
            console.log('Token: ' + s[0]);
        }

        if (parseFloat(s[0])) {
            //If a number
            this.output += parseFloat(s[0]) + ' '
            if (this.debug) {
                console.log('Add token to output');
                console.log('Output: ')
                console.log(this.output)
                console.log('Operator Stack: ')
                console.log(this.operatorStack)
            }

        } else if (!this.funcs.hasOwnProperty(s[0]) && s[0].match(/[a-zA-Z]{1}[0-9]*/)) {
            //if a variable
            this.output += s[0] + ' '
                //Count used variables
            if (this.used_variables.hasOwnProperty(s[0])) {
                this.used_variables[s[0]] += 1
            } else {
                this.used_variables[s[0]] = 1
            }
        } else {
            //Otherwise perform some computation splitted in different functions for semplicity
            this.functionToken(s[0])
            this.argumentSeparator(s[0])
            this.operator(s[0])
            this.leftParenthesis(s[0])
            this.rightParenthesis(s[0])
            if (this.debug) {
                console.log('Output: ')
                console.log(this.output)
                console.log('Operator Stack: ')
                console.log(this.operatorStack)
            }
        }
        //remove interpreted token
        s.splice(0, 1)
    }

    if (this.errors.length == 0) {
        //If no errors, perform the last step
        this.noMoreTokens()
    }
    //Trim final spaces
    this.output = this.output.trim()

    this.callback(this.errors, this.output, this.used_variables)
}


SYParser.prototype.functionToken = function(s) {
    if (this.funcs.hasOwnProperty(s)) {
        if (this.debug) console.log('Push token to operator stack');
        this.operatorStack.push(s);
    }
}


SYParser.prototype.argumentSeparator = function(s) {
    if (s == ',') {
        for (var i = this.operatorStack.length - 1; this.operatorStack[i] != '('; i--) {
            if (i == 0) {
                if (this.debug) console.log('Parsing Error')
                this.errors.push('Parsing Error');
                break
            } else {
                this.output += this.operatorStack.pop() + ' '
                if (this.debug) console.log('Pop token from operator stack to output');

            }
        }
    }
}


SYParser.prototype.operator = function(s) {

    if (this.operators.hasOwnProperty(s)) {
        if (this.debug) console.log(this.operators[this.operatorStack[this.operatorStack.length - 1]])

        function guard() {
            var guard = this.operators.hasOwnProperty(this.operatorStack[this.operatorStack.length - 1])
            var case1 = guard && this.operators[s].associativity == 'left' && this.operators[s].precedence <= this.operators[this.operatorStack[this.operatorStack.length - 1]].precedence
            var case2 = guard && this.operators[s].associativity == 'right' && this.operators[s].precedence < this.operators[this.operatorStack[this.operatorStack.length - 1]].precedence
            return (case1 || case2)
        }

        while (guard.bind(this)()) {
            this.output += this.operatorStack.pop() + ' '
            if (this.debug) console.log('Pop token from operator stack to output');
        }

        this.operatorStack.push(s)
        if (this.debug) console.log('Push token to operator stack');
    }
}


SYParser.prototype.leftParenthesis = function(s) {
    if (s == '(') {
        this.operatorStack.push(s);
        if (this.debug) console.log('Push token to operator stack');
    }
}


SYParser.prototype.rightParenthesis = function(s) {
    if (s == ')') {
        while (this.operatorStack[this.operatorStack.length - 1] != '(') {
            if (this.operatorStack.length != 0) {
                this.output += this.operatorStack.pop() + ' '
                if (this.debug) console.log('Pop token from operator stack to output');
            } else {
                this.errors.push('Mismatched parenthesis');
                if (this.debug) console.log('Mismatched parenthesis')
            }
        }

        if (this.debug) console.log(this.operatorStack[this.operatorStack.length - 1]);

        if (this.operatorStack[this.operatorStack.length - 1] == '(') {
            this.operatorStack.pop()
            if (this.debug) console.log('Pop token from operator stack');
        }

        if (this.funcs.hasOwnProperty(this.operatorStack[this.operatorStack.length - 1])) {
            this.output += this.operatorStack.pop() + ' '
            if (this.debug) console.log('Pop token from operator stack to output');
        }
    }
}

SYParser.prototype.noMoreTokens = function() {
    while (this.operatorStack[this.operatorStack.length - 1]) {
        var p = this.operatorStack.pop()
        if (p == '(' || p == ')') {
            if (this.debug) console.log('Mismatched parenthesis')
            this.errors.push('Mismatched parenthesis');
        } else {
            this.output += p + ' '
            if (this.debug) console.log('Pop token from operator stack to output');
        }
    }
}


module.exports = SYParser;


/**
 * Callback called when parse is finished.
 * @callback SYParser~parseCallback
 * @param {array} error - array of string of various errors
 * @param {string} output - output in postfix notation
 * @param {object} used_variables - list of used variables
 */


/**
 * Configuration Options passed to SYParser constructor.
 * @typedef {Object} SYParser~Options
 * @property {SYParser~OptionsFuncs} funcs - Available functions
 * @property {boolean} replace_default_funcs - should 'funcs' replace the default values? otherwise they are added
 * @property {SYParser~OptionsOperators} operators - Available operators
 * @property {boolean} replace_default_operators - should 'operators' replace the default values? otherwise they are added
 * @property {boolean} debug - enable console.log() debug mode
 * @example
 * var options = {
 *   funcs: {
 *     'max': {},
 *     'min': {},
 *     'sin': {},
 *     'cos': {},
 *     'abs': {},
 *     'sqrt': {},
 *     'rand': {},
 *   },
 *   replace_default_funcs: false,
 *
 *   operators: {
 *     '^': {precedence: 4, associativity: 'right'},
 *     '*': {precedence: 3, associativity: 'left'},
 *     '/': {precedence: 3, associativity: 'left'},
 *     '+': {precedence: 2, associativity: 'left'},
 *     '-': {precedence: 2, associativity: 'left'},
 *   },
 *   replace_default_operators: false,
 *
 *
 *   debug: false,
 * };
 */





/**
 * Strings recognized as Functions in the expression.
 * @typedef {Object} SYParser~OptionsFuncs
 * @property {EmptyObject} func1 - Func
 * @property {EmptyObject} func2 - Func
 * @property {EmptyObject} func3 - Func
 * @property {EmptyObject} ... - Func
 * @example <caption>Default Value</caption>
 {
     'abs': {},
     'cos': {},
     'exp': {},
     'log': {},
     'sin': {},
     'pow': {},
     'tan': {},
     'acos': {},
     'asin': {},
     'atan': {},
     'cbrt': {},
     'ceil': {},
     'cosh': {},
     'imul': {},
     'log2': {},
     'sign': {},
     'sinh': {},
     'sqrt': {},
     'tanh': {},
     'acosh': {},
     'asinh': {},
     'atan2': {},
     'atanh': {},
     'clz32': {},
     'expm1': {},
     'floor': {},
     'log10': {},
     'log1p': {},
     'round': {},
     'trunc': {},
     'fround': {},
     'random': {},
     'max': {},
     'min': {},
 }
 */

/**
 * Operators available.
 * @typedef {Object} SYParser~OptionsOperators
 * @property {Object} op1 - Operator
 * @property {Object} op2 - Operator
 * @property {Object} op3 - Operator
 * @property {Object} ... - Operator
 * @example <caption>Default Value</caption>
 {
     '^': {
         precedence: 4,
         associativity: 'right'
     },
     '*': {
         precedence: 3,
         associativity: 'left'
     },
     '/': {
         precedence: 3,
         associativity: 'left'
     },
     '%': {
         precedence: 3,
         associativity: 'left'
     },
     '+': {
         precedence: 2,
         associativity: 'left'
     },
     '-': {
         precedence: 2,
         associativity: 'left'
     },
 }
 */
