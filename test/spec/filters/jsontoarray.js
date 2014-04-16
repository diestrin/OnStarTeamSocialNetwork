'use strict';

describe('Filter: jsonToArray', function () {

  // load the filter's module
  beforeEach(module('ostApp'));

  // initialize a new instance of the filter before each test
  var jsonToArray;
  beforeEach(inject(function ($filter) {
    jsonToArray = $filter('jsonToArray');
  }));

  it('should return the input prefixed with "jsonToArray filter:"', function () {
    var text = 'angularjs';
    expect(jsonToArray(text)).toBe('jsonToArray filter: ' + text);
  });

});
