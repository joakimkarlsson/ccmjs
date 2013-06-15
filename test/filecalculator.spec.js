var expect = require('chai').expect;
var sinon = require('sinon');
var filecalculator = require('../lib/filecalculator');
var results = require('../lib/results');
var util = require('util');

describe('File calculator:', function() {
  var calculator,
      fs,
      ccmCalculator;

  
  beforeEach(function() {
    fs = {
      readFileSync: sinon.stub().returns('<content of file>')
    };

    ccmCalculator = {
      calculate: sinon.stub()
    };

    calculator = filecalculator.create(fs, ccmCalculator, results.createResult(25));
  });

  describe('parsing valid JavaScript files', function() {

    beforeEach(function() {
      ccmCalculator.calculate.returns([{ name: 'functionName', ccm: 12, line: 143 }])
    });

    it('reads content from files', function() {
      calculator.calculateFor(['file path 1', 'file path 2']);

      sinon.assert.calledWith(fs.readFileSync, 'file path 1');
      sinon.assert.calledWith(fs.readFileSync, 'file path 2');
    });

    it('thinks JavaScript files should be encoded in UTF-8', function() {
      calculator.calculateFor(['file path 1', 'file path 2']);

      sinon.assert.calledWith(fs.readFileSync, sinon.match.any, { 'encoding': 'utf8' });
    });

    it('calculates ccm for the content of the file', function() {
      calculator.calculateFor(['file path 1', 'file path 2']);
      sinon.assert.calledWith(ccmCalculator.calculate, '<content of file>');
    });

    it('returns the ccm calculations for the file content', function() {
      var res = calculator.calculateFor(['file path 1', 'file path 2']);

      expect(res.results).to.deep.equal([
                                        { file: 'file path 1', name: 'functionName', ccm: 12, line: 143 },
                                        { file: 'file path 2', name: 'functionName', ccm: 12, line: 143 }
      ]);
    });

    it('does not return any errors', function() {
      var res = calculator.calculateFor(['file path 1', 'file path 2']);

      expect(res.errors.length).to.equal(0);
    });

    describe('created with a file filter', function() {
      var filter;

      beforeEach(function() {
        filter = function(file) {
          return file.indexOf('include') !== -1;
        }

        calculator = filecalculator.create(fs, ccmCalculator, results.createResult(25), filter);
      });

      it('only loads files included in the filter', function() {
        calculator.calculateFor(['file to include', 'file to exclude']);
        sinon.assert.neverCalledWith(fs.readFileSync, 'file to exclude');
      });

    });
  });


  describe('parsing invalid javascript files', function() {
    
    beforeEach(function() {
      ccmCalculator.calculate.callsArgWith(1, {message: 'error message', line: 9, col: 7});
    });

    it('returns info about failing files', function() {
      var res = calculator.calculateFor(['file path 1', 'file path 2']);

      expect(res.errors.length).to.equal(2);
      expect(res.errors[0]).to.deep.equal({ file: 'file path 1', message: 'error message', line: 9, col: 7 });
      expect(res.errors[1]).to.deep.equal({ file: 'file path 2', message: 'error message', line: 9, col: 7 });
    });
  });

});
