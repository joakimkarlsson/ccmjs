var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var resultsFactory = require('../lib/results');
var util = require('util');

describe('results:', function() {
  var results;
  var mediumComplexity = {ccm: 15, name: 'mediumComplexFunction', line: 23},
    highComplexity = {ccm: 20, name: 'highComplexFunction', line: 32},
    lowComplexity = {ccm: 2, name: 'lowComplexFunction', line: 13},
    reallyLowComplexity = {ccm: 1, name: 'simpleFunction', line: 18},
    reallyHighComplexity = {ccm: 99, name: 'reallyComplexFunction', line: 997};

  it('store infinite amount of results if no capacity is defined', function() {
    results = resultsFactory.createResult();

    results.addResults('file', [
                       mediumComplexity,
                       lowComplexity,
                       reallyLowComplexity,
                       reallyHighComplexity,
                       highComplexity]);

    expect(results.results()).to.have.length(5);
  });

  describe('with a capacity of two', function() {

    beforeEach(function() {
      results = resultsFactory.createResult(2);
    });

    it('is initially empty', function() {
      expect(results.results()).to.have.length(0);
    });

    it('adds a result', function() {
      results.addResults('filename', [lowComplexity]);

      var actual = results.results();

      expect(actual).to.have.length(1);
      expect(actual[0]).to.deep.equal(withFile('filename', lowComplexity));
    });

    describe('containing two results:', function() {

      beforeEach(function() {
        results.addResults('file', [lowComplexity, highComplexity]);
      });

      it('disregards function with lower complexity than those stored', function() {
        results.addResults('file', [reallyLowComplexity]);

        expect(results.results()).not.to.contain(withFile('file', reallyLowComplexity));
      });

      it('removes results with low complexity when higher complexity is found', function() {
        results.addResults('file', [mediumComplexity]);

        expect(results.results()).to.contain.one.that.deep.equals(withFile('file', highComplexity));
        expect(results.results()).to.contain.one.that.deep.equals(withFile('file', mediumComplexity));
        expect(results.results()).not.to.contain.one.that.deep.equals(withFile('file', lowComplexity));
      });
    });

    describe('containing three results:', function() {
      beforeEach(function() {
        results = resultsFactory.createResult(3);
        results.addResults('file', [
                           lowComplexity,
                            highComplexity,
                            reallyLowComplexity]);
      });

      it('pushes out the two functions with lowest complexity if two higher functions are added', function() {
        results.addResults('file2', [mediumComplexity, reallyHighComplexity]);

        var res = results.results();
        expect(res).to.contain.one.that.deep.equals(withFile('file2', reallyHighComplexity));
        expect(res).to.contain.one.that.deep.equals(withFile('file2', mediumComplexity));
        expect(res).to.contain.one.that.deep.equals(withFile('file', highComplexity));
        expect(res).not.to.contain.one.that.deep.equals(withFile('file', lowComplexity));
        expect(res).not.to.contain.one.that.deep.equals(withFile('file', reallyLowComplexity));
      });
    });
  });

  function withFile(file, result) {
    var clone = JSON.parse(JSON.stringify(result));
    clone.file = file;
    return clone;
  }
});

