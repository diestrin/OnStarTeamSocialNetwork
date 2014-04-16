'use strict';

describe('Service: apiFriends', function () {

  // load the service's module
  beforeEach(module('ostApp'));

  // instantiate service
  var apiFriends;
  beforeEach(inject(function (_apiFriends_) {
    apiFriends = _apiFriends_;
  }));

  it('should do something', function () {
    expect(!!apiFriends).toBe(true);
  });

});
