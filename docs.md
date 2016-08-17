## Classes

<dl>
<dt><a href="#PNEvaluator">PNEvaluator</a></dt>
<dd></dd>
<dt><a href="#SYParser">SYParser</a></dt>
<dd></dd>
</dl>

<a name="PNEvaluator"></a>

## PNEvaluator
**Kind**: global class  
**Author:** Adileo Barone <adileo@barone.tech>  
<a name="new_PNEvaluator_new"></a>

### new PNEvaluator(string, callback, variables, options)
PNEvaluator - Evaluate a postfix notation math expression


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | math expression specified in postfix notation |
| callback | <code>PNEvaluator~evaluateCallback</code> |  | called when expression is evaluated |
| variables | <code>PNEvaluator~Variables</code> |  | values of variables in the expression |
| options | <code>PNEvaluator~Options</code> | <code></code> | configs |

**Example**  
```js
//returns: 4
new PNEvaluator('2 x +', function(errs, output){
 if(errs.length > 0){
   console.log(errs)
 }else{
   console.log(output)
 }
}, {x:2})
```
**Example** *(Available math functions)*  
```js
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
```
<a name="SYParser"></a>

## SYParser
**Kind**: global class  
**Author:** Adileo Barone <adileo@barone.tech>  

* [SYParser](#SYParser)
    * [new SYParser(string, callback, options)](#new_SYParser_new)
    * [~parseCallback](#SYParser..parseCallback) : <code>function</code>
    * [~Options](#SYParser..Options) : <code>Object</code>
    * [~OptionsFuncs](#SYParser..OptionsFuncs) : <code>Object</code>
    * [~OptionsOperators](#SYParser..OptionsOperators) : <code>Object</code>

<a name="new_SYParser_new"></a>

### new SYParser(string, callback, options)
SYParser - Shunting Yard Algorithm implementation


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | math expression specified in infix notation |
| callback | <code>[parseCallback](#SYParser..parseCallback)</code> |  | called when expression parsing is finished |
| options | <code>[Options](#SYParser..Options)</code> | <code></code> | configuration object |

**Example**  
```js
//returns: x 3 max 3 / 3.1415 * sin
new SYParser('sin(max(x,3)/3*3.1415)', function(errs, output){
 if(errs.length > 0){
   console.log(errs)
 }else{
   console.log(output)
 }
})
```
**Example** *(How variables are parsed)*  
```js
//Variables = 1 letter + integer(optional)
p12en -> p12 * e * n
mg -> m * g
xz10 -> x * z10
```
**Example** *(Parsed examples)*  
```js
//Input
3cos(2x) + lan * 2ab + n2e / n12mm + 22ab + gm12a + n2 + ngcos(2)
//Output
3 2 x * cos * l a * n * 2 * a * b * + n2 e * n12 / m * m * + 22 a * b * + g m12 * a * + n2 + n g * 2 cos * +
```
<a name="SYParser..parseCallback"></a>

### SYParser~parseCallback : <code>function</code>
Callback called when parse is finished.

**Kind**: inner typedef of <code>[SYParser](#SYParser)</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>array</code> | array of string of various errors |
| output | <code>string</code> | output in postfix notation |
| used_variables | <code>object</code> | list of used variables |

<a name="SYParser..Options"></a>

### SYParser~Options : <code>Object</code>
Configuration Options passed to SYParser constructor.

**Kind**: inner typedef of <code>[SYParser](#SYParser)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| funcs | <code>[OptionsFuncs](#SYParser..OptionsFuncs)</code> | Available functions |
| replace_default_funcs | <code>boolean</code> | should 'funcs' replace the default values? otherwise they are added |
| operators | <code>[OptionsOperators](#SYParser..OptionsOperators)</code> | Available operators |
| replace_default_operators | <code>boolean</code> | should 'operators' replace the default values? otherwise they are added |
| debug | <code>boolean</code> | enable console.log() debug mode |

**Example**  
```js
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
    '+': {precedence: 2, associativity: 'left'},
    '-': {precedence: 2, associativity: 'left'},
  },
  replace_default_operators: false,


  debug: false,
};
```
<a name="SYParser..OptionsFuncs"></a>

### SYParser~OptionsFuncs : <code>Object</code>
Strings recognized as Functions in the expression.

**Kind**: inner typedef of <code>[SYParser](#SYParser)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| func1 | <code>EmptyObject</code> | Func |
| func2 | <code>EmptyObject</code> | Func |
| func3 | <code>EmptyObject</code> | Func |
| ... | <code>EmptyObject</code> | Func |

**Example** *(Default Value)*  
```js
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
```
<a name="SYParser..OptionsOperators"></a>

### SYParser~OptionsOperators : <code>Object</code>
Operators available.

**Kind**: inner typedef of <code>[SYParser](#SYParser)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| op1 | <code>Object</code> | Operator |
| op2 | <code>Object</code> | Operator |
| op3 | <code>Object</code> | Operator |
| ... | <code>Object</code> | Operator |

**Example** *(Default Value)*  
```js
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
```
