var expect = require('chai').expect;
var ccm = require('../ccm');
var util = require('util');

describe('ccm', function() {
  it('counts an empty function as 1', function() {
    var func = 'function f(){}';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 1 );
  });

  it('counts an if statement as 1', function() {
    var func = 'function f(){ if(a) { b = 2; } }'; 

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts an else statement as 1', function() {
    var func = 'function f(){ if(a) { b = 2; } else { b = 3; } }'; 
    
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 3 );
  });

  it('counts a case statement as 1', function() {
    
    var func = 'function f(){switch(a) { case 1: b = 1; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts a default statement as 1', function() {
    var func = 'function f(){switch(a) { case 1: b = 1; default: b = 2; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 3 );
    
  });

  it('does not count an empty switch statement', function() {
    var func = 'function f() { switch(a) {} }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 1 );
  });


  it('counts a for loop as 1', function() {
    var func = 'function f() { var i, a; for(i = 0; i<10; i++){ a = i; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts while as 1', function() {
    var func = 'function f() { var a; while(a) { b = 1; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts do-while as 1', function() {
    var func = 'function f() { var a; do { b = 1; } while ( a ); }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `break` as 1', function() {
    var func = 'function f() { var a; while(a) { break; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 3 );
  });

  it('counts `continue` as 1', function() {
    var func = 'function f() { var a; while(a) { continue; } }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 3 );
  });

  it('counts `return` as 1 when not at the end of the function', function() {
    var func = 'function f() { var a=2; return a; b = 3; }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `throw` as 1 when not at the end of the function', function() {
    var func = 'function f() { var a=2; throw new Error("wat"); b = 3; }';

    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `catch` as 1', function() {
    var func = 'function f() { try { a = 3; } catch(e) {} }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `finally` as 1', function() {
    var func = 'function f() { try { a = 3; } finally {} }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `&&` as 1', function() {
    var func = 'function f() { var a = b && 2; }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `|| as 1', function() {
    var func = 'function f() { var a = b || 2; }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 2 );
  });

  it('counts `?:` as 2', function() {
	  debugger;
    var func = 'function f() { var a = b ? 1 : 2; }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 3 );
  });

  it('does not count `return` at the end of a function', function() {
    var func = 'function f() { return; }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 1 );
  });

  it('does not count `return` at the end of a function expression', function() {
    var func = 'var f = function() { return; };';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 1 );
  });

  it('ignores return with value at end of function', function() {
    var func = 'function f() { return 5; }';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'ccm', 1 );
  });

  it('reports the name for function', function() {
    var func = 'function f() {}';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'name', 'f' );
  });

  it('reports `<anonymous>` as name for anonymous functions', function() {
    var func = 'var a = function() {}';
    var res = ccm.calculate(func);
    expect(res[0]).to.have.property( 'name', '<anonymous>' );
  });

  it('returns complexity for multiple functions', function() {
    var code = 
      'function a() {}\n' +
      'function b() {}';

    var res = ccm.calculate(code);

    expect(res[0]).to.have.property('name', 'a');
    expect(res[0]).to.have.property('ccm', 1);
    expect(res[1]).to.have.property('name', 'b');
    expect(res[1]).to.have.property('ccm', 1);
  });

  it('returns line numbers for functions', function() {
    var code = 
      'function a() {}\n' +
      'function b() {}';

    var res = ccm.calculate(code);

    expect(res[0]).to.deep.equal({'name': 'a', 'line': 1, 'ccm': 1});
    expect(res[1]).to.deep.equal({'name': 'b', 'line': 2, 'ccm': 1});
  });

  it('ignores shebangs in files', function() {
    var code = 
      '#!/usr/bin/env node\n' +
      'function func() {}';

    var res = ccm.calculate(code);

    expect(res[0]).to.deep.equal({'name': 'func', 'line': 2, 'ccm': 1});
  });

  it('handles nested functions', function() {
	  var code = 
		  '(function() {\n' +
		  '	var a;\n' +
		  '	if(true) {\n' +
		  '		a = b();\n' +
		  '	}\n' +
		  '\n' +
		  '	function b() {\n' +
		  '		return 3;\n' +
		  '	}\n' +
		  '})();\n'; 

	  var res = ccm.calculate(code);

	  expect(res).to.contain.one.deep.equal({'name': '<anonymous>', 'line': 1, 'ccm': 2});
	  expect(res).to.contain.one.deep.equal({'name': 'b', 'line': 7, 'ccm': 1});
  });
});
