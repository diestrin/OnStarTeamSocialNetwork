'use strict';

describe('Service: apiUsers', function () {

  // load the service's module
  beforeEach(module('ostApp'));

  // instantiate service
  var apiUsers;
  beforeEach(inject(function (_apiUsers_) {
    apiUsers = _apiUsers_;
  }));

  it('should do something', function () {
    expect(!!apiUsers).toBe(true);
  });

});
