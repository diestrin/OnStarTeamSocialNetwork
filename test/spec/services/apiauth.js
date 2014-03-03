'use strict';

describe('Service: apiAuth', function () {

  // load the service's module
  beforeEach(module('OST-API'));

  // instantiate service
  var apiAuth, $rootScope, MemoryAdapter;
  beforeEach(inject(function (_$rootScope_, _apiAuth_, _MemoryAdapter_) {
    apiAuth = _apiAuth_;
    $rootScope = _$rootScope_;
    MemoryAdapter = _MemoryAdapter_;
  }));

  // Register an user
  var user, newUser;
  beforeEach(function () {
    MemoryAdapter.reset();

    user = {
      username: 'diestrin',
      password: 'test1234',
      email: 'diego.barahona@prodigious.cr',
      name: 'Diego Barahona'
    };

    newUser = undefined;

    apiAuth.register(user.username, user.password, user.name, user.email)
    .then(function (_user) {
      newUser = _user;
    });

    $rootScope.$digest();
  });

  describe('# register #', function () {

    it('should register a new user', function () {
      expect(newUser).toBeDefined();
      expect(newUser.username).toBe(user.username);
      expect(newUser.__password).toBe(user.password);
      expect(newUser.name).toBe(user.name);
      expect(newUser.email).toBe(user.email);
    });

    it('should\'t allow to register the same user again', function () {
      var failRegister;

      failRegister = jasmine.createSpy('failRegister');
      newUser = undefined;

      apiAuth.register(user.username, user.password, user.name, user.email)
      .catch(failRegister)
      .finally(function () {
        expect(failRegister)
          .toHaveBeenCalledWith(apiAuth.ERROR_REGISTER_USER_ALREADY_EXISTS);
      });

      $rootScope.$digest();
    });
  });

  describe('# login #', function () {
    var failLogin;
    beforeEach(function () {
      failLogin = jasmine.createSpy('failLogin');
    });

    it('should login an existing user', function () {
      var userInfo;

      apiAuth.login(user.username, user.password)
      .then(function (info) {
        userInfo = info;
      })
      .finally(function () {
        expect(userInfo).toBeDefined();
        expect(userInfo.name).toBe(user.name);
      });

      $rootScope.$digest();
    });

    it('should\'t loging a user when another is in session', function () {
      apiAuth.login(user.username, user.password)
      .then(function () {
        return apiAuth.login(user.username, user.password);
      })
      .catch(failLogin)
      .finally(function () {
        expect(failLogin)
          .toHaveBeenCalledWith(apiAuth.ERROR_LOGIN_USER_IN_SESSION);
      });

      $rootScope.$digest();
    });

    it('should\'t loging a non existing user', function () {
      apiAuth.login('test', 'test1234').catch(failLogin)
      .finally(function () {
        expect(failLogin)
          .toHaveBeenCalledWith(apiAuth.ERROR_LOGIN_INVALID_USERNAME);
      });

      $rootScope.$digest();
    });

    it('should\'t loging an user with a wrong password', function () {
      apiAuth.login(user.username, 'randomPassword').catch(failLogin)
      .finally(function () {
        expect(failLogin)
          .toHaveBeenCalledWith(apiAuth.ERROR_LOGIN_INVALID_PASSWORD);
      });

      $rootScope.$digest();
    });
  });

  describe('# logout #', function () {

    it('should logout a user in session', function () {
      var succcesLogout;

      succcesLogout = jasmine.createSpy('succcesLogout');

      apiAuth.login(user.username, user.password)
      .then(apiAuth.logout).then(succcesLogout)
      .finally(expect(succcesLogout).toHaveBeenCalled);

      $rootScope.$digest();

    });

    it('should\'t logout a user if no one is in session', function () {
      var failLogout;

      failLogout = jasmine.createSpy('failLogout');

      apiAuth.logout().catch(failLogout)
      .finally(function () {
        expect(failLogout)
          .toHaveBeenCalledWith(apiAuth.ERROR_LOGOUT_NO_USER_IN_SESSION);
      });

      $rootScope.$digest();
    });
  });

  describe('# getCurrentUser #', function () {
    beforeEach(function () {
      apiAuth.logout();
    });

    it('should return the current user in session', function () {
      apiAuth.login(user.username, user.password)
      .then(function () {
        var currentUser = apiAuth.getCurrentUser();

        expect(currentUser.name).toBe(user.name);
        expect(currentUser.email).toBe(user.email);
        expect(currentUser.username).toBe(user.username);
        expect(currentUser.password).toBeUndefined();
        expect(currentUser.__password).toBeUndefined();
      });

      $rootScope.$digest();
    });

    it('shouldn\'t return the current user if no one is in session', function () {
      var currentUser = apiAuth.getCurrentUser();

      expect(currentUser).toBeNull();
    });
  });

  describe('# getCurrentUserStatus #', function () {
    beforeEach(function () {
      apiAuth.logout();
    });

    afterEach(function () {
      apiAuth.logout();
      MemoryAdapter.reset();
    });

    it('should return the current status', function () {

      expect(apiAuth.getCurrentUserStatus()).toBe(apiAuth.USER_STATUS_GUEST);

      apiAuth.login(user.username, user.password)
      .then(function () {
        expect(apiAuth.getCurrentUserStatus()).toBe(apiAuth.USER_STATUS_AUTH);
      });

      $rootScope.$digest();
    });
  });

  describe('policy checking', function () {
    beforeEach(function () {
      apiAuth.logout();
    });

    it('should ensure the current user status be on rule', function () {
      expect(apiAuth.__isCurrentStatusOnPolicy('USER_STATUS_GUEST')).toBe(true);
      expect(apiAuth.__isCurrentStatusOnPolicy('USER_STATUS_AUTH')).toBe(false);

      apiAuth.login(user.username, user.password)
      .then(function () {
        expect(apiAuth.__isCurrentStatusOnPolicy('USER_STATUS_GUEST')).toBe(false);
        expect(apiAuth.__isCurrentStatusOnPolicy('USER_STATUS_AUTH')).toBe(true);
      });

      $rootScope.$digest();
    });
  });
});
