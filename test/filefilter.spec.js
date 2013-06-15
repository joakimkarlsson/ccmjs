var expect = require('chai').expect;
var fileFilter = require('../lib/filefilter.js');

describe('File filter:', function() {
  
  it('includes nothing if no patterns are passed to it', function() {
    var filter = fileFilter.create();
    expect(filter("./should/not/be/included")).to.not.be.ok;
  });

  it('includes files that matches perfectly', function() {
    var filter = fileFilter.create(['./should/be/included']);
    expect(filter("./should/be/included")).to.be.ok;
  });

  it('does not include files that does not match', function() {
    var filter = fileFilter.create(['./should/be/included']); 
    expect(filter("./should/not/be/included")).to.not.be.ok;
  });

  it('includes file that matches glob pattern', function() {
    var filter = fileFilter.create(['./should/**/included']); 
    expect(filter("./should/also/be/included")).to.be.ok;
  });
});
