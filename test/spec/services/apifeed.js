'use strict';

describe('Service: apiFeed', function () {

  // load the service's module
  beforeEach(module('ostApp'));

  // instantiate service
  var apiFeed;
  beforeEach(inject(function (_apiFeed_) {
    apiFeed = _apiFeed_;
  }));

  it('should do something', function () {
    expect(!!apiFeed).toBe(true);
  });

});
