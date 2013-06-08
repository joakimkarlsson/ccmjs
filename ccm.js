var uglify = require('uglify-js');
var util = require('util');
var equal = require('deep-equal');

function calculate(func) {
  var toplevel = uglify.parse(func);

  // console.log(util.inspect(toplevel, {depth: null, colors: true}));

  var ccm = 1;

  var treeWalker = new uglify.TreeWalker(function(node) {
    if(node instanceof uglify.AST_If) {
      ccm += 1;

      if(node.alternative) {
        ccm += 1;
      }
    }

    if(node instanceof uglify.AST_SwitchBranch) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_For) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_While) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_Do) {
      ccm += 1;
    }


    if(node instanceof uglify.AST_Jump) {
      if(node instanceof uglify.AST_Return) {
        var myfunc = treeWalker.find_parent(uglify.AST_Defun);
        if(equal(myfunc.body[myfunc.body.length-1], node)) {
          return;
        }
      }
      ccm += 1;
    }

    if(node instanceof uglify.AST_Catch) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_Finally) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_Binary && (node.operator === '&&' || node.operator === '||')) {
      ccm += 1;
    }

    if(node instanceof uglify.AST_Conditional) {
      ccm += 2;
    }

  });

  toplevel.walk(treeWalker);

  return ccm;
}

module.exports = {
  calculate: calculate
}
