var expect = require('chai').expect;
var ccm = require('../ccm');

describe('ccm', function() {
  it('counts empty function as one', function() {
    var func = 'function f(){}';

    expect(ccm.calculate(func)).to.equal(1);
  });

  it('counts one if statement as 2', function() {
    var func = 'function f(){ if(a) { b = 2; } }'; 

    expect(ccm.calculate(func)).to.equal(2);
  });
});
