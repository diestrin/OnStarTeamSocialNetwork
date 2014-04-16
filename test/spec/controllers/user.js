'use strict';

describe('Controller: UserUsernameCtrl', function () {

  // load the controller's module
  beforeEach(module('ostApp'));

  var UserUsernameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserUsernameCtrl = $controller('UserUsernameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
