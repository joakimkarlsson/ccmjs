var uglify = require('uglify-js');
var util = require('util');
var equal = require('deep-equal');

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

function calculate(code) {
  var processedCode = preprocess(code);
  var toplevel = uglify.parse(processedCode);

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

function createResult(capacity) {
  var _results = [];

  function addResult(result) {
    var i,
        len,
        added = false;

    if(_results.length == 0) {
      _results.push(result);
      return;
    }

    for(i=0, len = _results.length; i<len; i += 1) {
      if(result.ccm > _results[i].ccm) {
        _results.splice(i, 0, result);
        added = true;
        break;
      }
    }

    if(!added) {
      _results.push(result);
    }

    if(capacity && _results.length > capacity) {
      _results.splice(-1, 1);
    }
  }

  function addResults(file, results) {
    var i, len;

    for(i = 0, len = results.length; i < len; i += 1) {
      addResult({file: file, ccm: results[i].ccm, line: results[i].line, name: results[i].name});
    }
  }

  return {
    results: function() {
      return _results;
    },
    addResults: addResults
  };
}

function formatResult(results) {
  var i,
      len,
      res = results.results(),
      strings = [];

      
  function getCategorization(ccm) {
    if(ccm <= 10) {
      return 'simple, without much risk';
    }

    if(ccm <= 20) {
      return 'more complex, moderate risk';
    }

    if(ccm <= 50) {
      return 'complex, high risk';
    }

    return 'untestable, very high risk';
    
  }

  for(i = 0, len = res.length; i<len; i += 1) {
    strings.push(res[i].file + '(' + res[i].line + '): \'' + res[i].name + '\' ' + res[i].ccm + ' (' + getCategorization(res[i].ccm) + ')');
  }

  return strings;
}

module.exports = {
  calculate: calculate,
  createResult: createResult,
  formatResult: formatResult
}
