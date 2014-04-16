'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('OSTApp'));

  var LoginCtrl,
      $scope,
      $rootScope,
      $httpBackend,
      user,
      apiAuth;

  // Inject the services
  beforeEach(inject(function (_$rootScope_, _apiAuth_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    apiAuth = _apiAuth_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    $scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: $scope
    });
  }));

  // Create the user
  beforeEach(function () {
    user = {
      username: 'diestrin',
      password: 'test1234',
      email: 'diego.barahona@prodigious.cr',
      name: 'Diego Barahona'
    };
  });

  // Mock the requests
  beforeEach(function () {
    $httpBackend.when('GET', 'views/main.html').respond('');
  });

  it('should register an existing user and then sign in', function () {
    LoginCtrl.registration(user)
    .then(function () {
      var _user = angular.copy(user);
      delete _user.password;
      expect(apiAuth.getCurrentUser()).toEqual(_user);
    })
    .finally(apiAuth.logout);

    $rootScope.$digest();
  });

  it('should signin an existing user', function () {
    LoginCtrl.signin(user)
    .then(function () {
      var _user = angular.copy(user);
      delete _user.password;
      expect(apiAuth.getCurrentUser()).toEqual(_user);
    })
    .finally(apiAuth.logout);

    $rootScope.$digest();
  });

  it('should return the corresponding error when login an unregistered user', function () {
    LoginCtrl.signin({username: 'casa', password: 'casita'})
    .finally(function () {
      expect(LoginCtrl.displayError).toEqual(apiAuth.ERROR_LOGIN_INVALID_USERNAME);
    });

    $rootScope.$digest();
  });
});
