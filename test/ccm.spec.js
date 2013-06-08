var expect = require('chai').expect;
var ccm = require('../ccm');

describe('ccm', function() {
  it('counts an empty function as 1', function() {
    var func = 'function f(){}';

    expect(ccm.calculate(func)).to.equal(1);
  });

  it('counts an if statement as 1', function() {
    var func = 'function f(){ if(a) { b = 2; } }'; 

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts an else statement as 1', function() {
    var func = 'function f(){ if(a) { b = 2; } else { b = 3; } }'; 
    
    expect(ccm.calculate(func)).to.equal(3);
  });

  it('counts a case statement as 1', function() {
    
    var func = 'function f(){switch(a) { case 1: b = 1; } }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts a default statement as 1', function() {
    var func = 'function f(){switch(a) { case 1: b = 1; default: b = 2; } }';

    expect(ccm.calculate(func)).to.equal(3);
    
  });

  it('does not count an empty switch statement', function() {
    var func = 'function f() { switch(a) {} }';

    expect(ccm.calculate(func)).to.equal(1);
  });

  it('does not count a switch statement containing only a default');

  it('counts a for loop as 1', function() {
    var func = 'function f() { var i, a; for(i = 0; i<10; i++){ a = i; } }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts while as 1', function() {
    var func = 'function f() { var a; while(a) { b = 1; } }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts do-while as 1', function() {
    var func = 'function f() { var a; do { b = 1; } while ( a ); }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `break` as 1', function() {
    var func = 'function f() { var a; while(a) { break; } }';

    expect(ccm.calculate(func)).to.equal(3);
  });

  it('counts `continue` as 1', function() {
    var func = 'function f() { var a; while(a) { continue; } }';

    expect(ccm.calculate(func)).to.equal(3);
  });

  it('counts `return` as 1 when not at the end of the function', function() {
    var func = 'function f() { var a=2; return a; b = 3; }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `throw` as 1 when not at the end of the function', function() {
    var func = 'function f() { var a=2; throw new Error("wat"); b = 3; }';

    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `catch` as 1', function() {
    var func = 'function f() { try { a = 3; } catch(e) {} }';
    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `finally` as 1', function() {
    var func = 'function f() { try { a = 3; } finally {} }';
    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `&&` as 1', function() {
    var func = 'function f() { var a = b && 2; }';
    expect(ccm.calculate(func)).to.equal(2);
  });

  it('counts `|| as 1', function() {
    var func = 'function f() { var a = b || 2; }';
    expect(ccm.calculate(func)).to.equal(2);
  });

  it('does not count `return` at the end of a function');
  it('does not count `throw` at the end of a function');
});
