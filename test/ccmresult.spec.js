var expect = require('chai').expect;
var ccm = require('../ccm');

describe('ccmResult:', function() {
  var results;
  var mediumComplexity = {file: 'file1', ccm: 15, name: 'mediumComplexFunction', line: 23},
    highComplexity = {file: 'file1', ccm: 20, name: 'highComplexFunction', line: 32},
    lowComplexity = {file: 'file1', ccm: 2, name: 'lowComplexFunction', line: 13},
    reallyLowComplexity = {file: 'file1', ccm: 1, name: 'simpleFunction', line: 18},
    reallyHighComplexity = {file: 'file1', ccm: 99, name: 'reallyComplexFunction', line: 997};

  it('store infinite amount of results if no capacity is defined', function() {
    results = ccm.createResult();

    results.addResult(mediumComplexity);
    results.addResult(lowComplexity);
    results.addResult(reallyLowComplexity);
    results.addResult(reallyHighComplexity);
    results.addResult(highComplexity);

    expect(results.results()).to.have.length(5);
  });

  describe('with a capacity of two', function() {

    beforeEach(function() {
      results = ccm.createResult(2);
    });

    it('is initially empty', function() {
      expect(results.results()).to.have.length(0);
    });

    it('adds a result', function() {
      var resultToAdd = {file: 'filename', name: 'functionName', ccm: 2, line: 3};
      results.addResult(resultToAdd);

      var actual = results.results();

      expect(actual).to.have.length(1);
      expect(actual[0]).to.deep.equal(resultToAdd);
    });

    describe('containing two results:', function() {

      beforeEach(function() {
        results.addResult(lowComplexity);
        results.addResult(highComplexity);
      });

      it('disregards function with lower complexity than those stored', function() {
        results.addResult(reallyLowComplexity);

        expect(results.results()).not.to.contain(reallyLowComplexity);
      });

      it('removes results with low complexity when higher complexity is found', function() {
        results.addResult(mediumComplexity);

        expect(results.results()).to.contain(highComplexity);
        expect(results.results()).to.contain(mediumComplexity);
        expect(results.results()).not.to.contain(lowComplexity);
      });
    });

    describe('containing three results:', function() {
      beforeEach(function() {
        var results = ccm.createResult(3);
        results.addResult(lowComplexity);
        results.addResult(highComplexity);
        results.addResult(reallyLowComplexity);
      });

      it('pushes out the two functions with lowest complexity if two higher functions are added', function() {
        results.addResult(mediumComplexity);
        results.addResult(reallyHighComplexity);

        expect(results.results()).to.contain(reallyHighComplexity);
        expect(results.results()).to.contain(mediumComplexity);
        expect(results.results()).not.to.contain(lowComplexity);
        expect(results.results()).not.to.contain(reallyLowComplexity);
      });
    });
  });
});

