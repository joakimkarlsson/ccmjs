var expect = require('chai').expect;
var resultsFactory = require('../lib/results');
var formatter = require('../lib/formatter');

describe('formatResult:', function() {
  var results;
  
  beforeEach(function() {
    results = resultsFactory.createResult();

    results.addResults('a/file', [{ ccm: 5, name: 'withoutMuchRiskFunction', line: 12},
    { ccm: 25, name: 'highRiskFunction', line: 74},
    { ccm: 12, name: 'moderateRiskFunction', line: 34},
    { ccm: 51, name: 'untestableFunction', line: 173}]);
  });

  it('formats the result according to sei thresholds', function() {
    expect(formatter.formatResult(results.results())).to.deep.equal([
      'a/file(173): \'untestableFunction\' 51 (untestable, very high risk)',
      'a/file(74): \'highRiskFunction\' 25 (complex, high risk)',
      'a/file(34): \'moderateRiskFunction\' 12 (more complex, moderate risk)',
      'a/file(12): \'withoutMuchRiskFunction\' 5 (simple, without much risk)',

    ]);
  });
});
