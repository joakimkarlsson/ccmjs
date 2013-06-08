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

});
