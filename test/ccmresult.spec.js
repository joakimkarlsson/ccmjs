var expect = require('chai').expect;
var ccm = require('../ccm');

describe('ccmResult:', function() {
  var results;

  beforeEach(function() {
    results = ccm.createResult();
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
});

