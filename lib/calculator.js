var uglify = require('uglify-js');
var util = require('util');
var equal = require('deep-equal');

function calculate(code, errorCallback) {
  var processedCode = preprocess(code);

  try {
    var toplevel = uglify.parse(processedCode);
  }
  catch(err) {
    if(errorCallback && err instanceof uglify.JS_Parse_Error) {
      errorCallback({message: err.message, line: err.line, col: err.col});
      return;
    }

    throw err;
  }

  var result = [];

  var treeWalker = new uglify.TreeWalker(function(node) {
    var functionStats = {};

    if(node instanceof uglify.AST_Function || node instanceof uglify.AST_Defun) {
      functionStats = calculateForFunction(node);

      result = result.concat(functionStats);
	  return true;
    }
  });

  toplevel.walk(treeWalker);

  return result;
}

function ccmForSimpleBranches(node) {
  if(node instanceof uglify.AST_SwitchBranch ||
     node instanceof uglify.AST_For ||
       node instanceof uglify.AST_While ||
         node instanceof uglify.AST_Do ||
           node instanceof uglify.AST_Catch ||
             node instanceof uglify.AST_Finally) {
    return 1;
  }

  return 0;
}

function ccmForConditional (node) {
  if(node instanceof uglify.AST_Conditional) {
    return 2;
  }

  return 0;
}

function ccmForBinaryOperators (node) {
  if(node instanceof uglify.AST_Binary && (node.operator === '&&' || node.operator === '||')) {
    return 1;
  }

  return 0;
}

function ccmForJumps (node, func) {

  function returnAtEndOfFunction () {
    function isLastStatement () {
      return equal(func.body[func.body.length-1], node); 
    }

    return node instanceof uglify.AST_Return && isLastStatement();
  }

  if(node instanceof uglify.AST_Jump && !returnAtEndOfFunction()) {
    return 1;
  }

  return 0;
}

function ccmForIfElse (node) {
  var ccm = 0;

  if(node instanceof uglify.AST_If) {
    ccm += 1;

    if(node.alternative) {
      ccm += 1;
    }
  }
  
  return ccm;
}

function calculateForFunction (func) {
	var ccm = 1,
	stats = [];

	var calculators = [
		ccmForIfElse,
		ccmForJumps,
		ccmForBinaryOperators,
		ccmForConditional,
		ccmForSimpleBranches
	];

	var walker = new uglify.TreeWalker(function(node) {
		if(node instanceof uglify.AST_Function || node instanceof uglify.AST_Defun) {
			if(!equal(node, func)) {
				stats = stats.concat(calculateForFunction(node));
				return true;
			}
		}
		else {
			for (var i = calculators.length - 1; i >= 0; i--) {
				var ccmForBranch = calculators[i](node, func);

				if(ccmForBranch > 0) {
					ccm += ccmForBranch;
					break;
				}
			};

		}
	})

	func.walk(walker);

	stats.push({
		name: func.name ? func.name.name : '<anonymous>',
		ccm: ccm,
		line: func.start.line
	});

	return stats;
}

function preprocess(code) {
  // Comment out shebangs
  return code.replace(/^\s*#\!/, '//$&');
}

module.exports = {
  calculate: calculate
}
