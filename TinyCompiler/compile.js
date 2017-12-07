/*************************************
Tiny compiler that convert lisp like language into C
        lisp        C
2 + 3   (add 2 3)   add(2,3)

Components => 
* Tokenizer
* Parser
* Transformation  
* Code Generation  

**************************************/

/*************************************
********  Lexical tokenizer  *********

  takes raw code and convert it into tokens/lexemes

  We will define 4 token types - 
  name - function names
  paren - parethesis
  number - numbers
  string - strings

  Input =>
  (add 2 (multiply 3 4))
  
  Output =>
  [
    {type : 'paren', value : '('}
    {type : 'name', value : 'add'}
    {type : 'number', value : '2'}
    {type : 'paren', value : '('}
    {type : 'name', value : 'multiply'}
    {type : 'number', value : '3'}
    {type : 'number', value : '4'}
    {type : 'paren', value : ')'}
    {type : 'paren', value : ')'}
  ]

  so the tokenizer function takes an string as input and 
  output array of tokens

**************************************/

function tokenizer(input){
	
	let tokens = [];
	let cur = 0; // current position
	while(cur < input.length){	
		let char = input[cur];

		// case 0 
		// handle whitespaces
		let white = /\s/;
		if (white.test(char)) {
			cur++;
			continue;
		}

		// case 1
		// handle parentesis
		if(char === '(' || char === ')'){
			tokens.push({type : 'paren', value : char});
			cur++;
			continue;
		}

		// case 2
		// handle numbers
		let num = /[0-9]/;
		if (num.test(char)) {
			let value = ''; //store value of the whole number
			while(num.test(char)){
				value += char;
				char = input[++cur];
			}
			tokens.push({type : 'number', value : value});
			continue;
		}

		// case 3
		// handle string
		// will be in ""
		// (append "fizz" "buzz")
		if(char === '"'){
			let value = '';
			char = input[++cur];
			while(char !== '"' && cur < input.length){
				value += char;
				char = input[++cur];
			}
			tokens.push({type : 'string', value : value});
			cur++;
			continue;
		}

		// case 4
		// handle function names
		let letter =  /[a-z]/i;
		if(letter.test(char)){
			let value = '';
			while(letter.test(char)){
				value += char;
				char = input[++cur];
			}
			tokens.push({type: 'name', value : value});
			continue;
		}

		// case 5
		// handle unknown char
		throw new TypeError('unknown input character: ' + char);
	}

	return tokens;
}

// test tokenizer
// console.log(tokenizer('(add 2 (multiply 3 4))'));

/*************************************
************** Parser ****************

  takes array of tokens as input and converts it into
  a intermediate form Abstract Syntax Tree (AST)
  AST describes each part of the syntax and their relation
  to one another

  Input =>
  (add 2 (multiply 3 4)) 

  Tokens =>
  [
    {type : 'paren', value : '('},
    {type : 'name', value : 'add'},
    {type : 'number', value : '2'},
    {type : 'paren', value : '('},
    {type : 'name', value : 'multiply'},
    {type : 'number', value : '3'},
    {type : 'number', value : '4'},
    {type : 'paren', value : ')'},
    {type : 'paren', value : ')'}
  ]

  Output =>
  {
	type : 'Program',
	body : [{
		type : 'CallExpression',
		name : 'add',
		params : [{
			type : 'NumberLiteral',
			value : '2'
		}, {
			type : 'CallExpression',
			name : 'multiply',
			params : [{
				type : 'NumberLiteral',
				value : '3'
			}, {
				type : 'NumberLiteral',
				value : '4'
			}]
		}]
	}]
  }
  
  AST representation =>    
  			add
  		   /   \
          2    multiply
                 /  \
				3	 4

*************************************/

function parser(tokens){

	let cur = 0;
	function parse(){

		let token = tokens[cur];

		// case 1
		// handle number or string
		if(token.type === 'number'){
			cur++;
			return {
				type : 'NumberLiteral',
				value : token.value
			};
		}

		if(token.type === 'string'){
			cur++;
			return {
				type : 'StringLiteral',
				value : token.value
			};
		}

		// case 2
		// handle parentesis and functions
		if(token.type === 'paren' && token.value === '('){
			
			token = tokens[++cur];
			let tok = {
				type : 'CallExpression',
				name : token.value,
				params : [] 
			};
			token = tokens[++cur];
			while (	token.value !== ')'){
        		tok.params.push(parse());
        		token = tokens[cur];
        	}

        	cur++;
        	return tok;
    	}

    	// case 3
    	// unknown type
		throw new TypeError(token.type);
	}

	// construct ast

	let ast = {
		type : 'Program',
		body : []
	};

	while(cur < tokens.length){
		ast.body.push(parse());	
	}
	
	return ast;
}

// test parser
// console.log(parser(tokenizer('(add 2 (multiply 3 4))')));

/*************************************
************ Traverser  **************

	to create a traversal on ast such that 
	we can visit all nodes and construct a new ast
	This traversal will visit every node in 
	depth first manner.

	we are going to create a “visitor” object that has 
	methods that will accept different node types.

	var visitor = {
	    NumberLiteral(node, parent) {},
	   CallExpression(node, parent) {},
 	};


	The order of traversal will look like this -
	input
	- CallExpression
	    - NumberLiteral
	    - CallExpression
			- NumberLiteral
        	- NumberLiteral
	output
	-> CallExpression (enter)
	    -> Number Literal (enter)
        <- Number Literal (exit)
        -> Call Expression (enter)
        	-> Number Literal (enter)
        	<- Number Literal (exit)
        	-> Number Literal (enter)
        	<- Number Literal (exit)
        <- CallExpression (exit)
    <- CallExpression (exit)


	In order to support that, our visitor will look like:
	var visitor = {
	  NumberLiteral: {
	   enter(node, parent) {},
	    exit(node, parent) {},
	  }
	};

	Traversal function will take input the ast and the visitor node

************************************/

function traverser(ast, visitor){

	// to traverse all childs in a node
	function traverseArray(array, parent) {
    	array.forEach(child => traverseNode(child, parent));
  	}

	// takes node and its parent and passes it to visitor methods
	function traverseNode(node, parent) {

	    let methods = visitor[node.type];

	    // first we will enter the node
    	if (methods && methods.enter) {
    	    methods.enter(node, parent);
    	}

    	// Next we are going to split things up by the current node type.
    	switch (node.type) {

    		// handle program and traverse body
    		case 'Program':
        		traverseArray(node.body, node);
        		break;

	    	// handle `CallExpression` and traverse their `params`.
    		case 'CallExpression':
        		traverseArray(node.params, node);
        		break;

	    	// handle numbers and string
    		case 'NumberLiteral':
      		case 'StringLiteral':
        		break;

	      	// handle unknown type
    	  	default:
        		throw new TypeError(node.type);
    	}

    	// exit the node
    	if (methods && methods.exit) {
      		methods.exit(node, parent);
    	}
  	}	

  	// start traversing
  	traverseNode(ast, null);

}

/*************************************
************ Transformer  ************

	takes lisp ast as input and 
	gives c ast as output

	traverse through ast and construct new ast

	input - 
	{                             
		type: 'Program',            
  		body: [{                    
    		type: 'CallExpression',   
    		name: 'add',              
    		params: [{                
      			type: 'NumberLiteral',  
      			value: '2'              
    		}, {                      
      			type: 'CallExpression', 
      			name: 'multiply',       
      			params: [{              
        			type: 'NumberLiteral',
        			value: '3'            
      			}, {                    
        			type: 'NumberLiteral',
        			value: '4'            
      			}]                      
    		}]                        
  		}]                          
	}                             

	output -
	{
		type: 'Program',            
  		body: [{
			type: 'ExpressionStatement',
			expression: {
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'add'
				},
				arguments : [{
					type: 'NumberLiteral',
					value: '2'
				},
				{
					type : 'CallExpression',
					callee : {
						type : 'Identifier',
						name : 'multiply',
						arguments : [{
							type : 'NumberLiteral',
							value : '3'
						},{
							type : 'NumberLiteral',
							value : '4'
						}] 
					}
				}]
			}
  		}]
	}

************************************/

function transformer(ast) {

  let newAst = {
    type: 'Program',
    body: [],
  };

  // Context is a reference from the old ast to new ast
  ast._context = newAst.body;

  // call the traverser function with our ast and a visitor.
  traverser(ast, {

    // create number and string nodes
    NumberLiteral: {

      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // Next up, `CallExpression`.
    CallExpression: {
      enter(node, parent) {

        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        // define context of this
        node._context = expression.arguments;

        // check if the parent node is a `CallExpression`.
        // If it is not...
        if (parent.type !== 'CallExpression') {

          // wrap our `CallExpression` node with an
          // `ExpressionStatement`. 
          // We do this because the top level
          // `CallExpression` in JavaScript are actually statements.
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    }
  });

  return newAst;
}

// test transformer
// console.log(transformer(parser(tokenizer('(add 2 (multiply 3 4))'))));

/*************************************
**********  Code Generator  **********
	
	converts new ast to c code

**************************************/

function codeGenerator(node) {

  switch (node.type) {

  	// handle program
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');

    // handle statements
    case 'ExpressionStatement':
      return ( codeGenerator(node.expression) + ';' );

    // handle functions arguments
    case 'CallExpression':
      return ( codeGenerator(node.callee) +
        '(' + node.arguments.map(codeGenerator).join(', ') + ')'
      );

    // handle function names
    case 'Identifier':
      return node.name;

    // handle numbers and strings
    case 'NumberLiteral':
      return node.value;

    case 'StringLiteral':
      return '"' + node.value + '"';

    //handle unknown type
    default:
      throw new TypeError(node.type);
  }
}

/*************************************
*************  Compiler  *************
**************************************/

// tunnel everything into a compiler
function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}

// also export everything
module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler,
};