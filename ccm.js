var uglify = require('uglify-js');
var util = require('util');


function calculate(code) {
  var toplevel = uglify.parse(code);

  var ccm = 1;

  toplevel.walk(new uglify.TreeWalker(function(node) {
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
  }));


  return ccm;
}

module.exports = {
  calculate: calculate
}
