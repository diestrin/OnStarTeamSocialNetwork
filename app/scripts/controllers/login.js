'use strict';

/**
 * @ngdoc controller
 * @name OSTApp.controller:LoginCtrl
 *
 * @description
 * The controller of the login route.
 * Handles things like registration and sign in
 *
 * @requires ng.$scope
 * @requires ng.$location
 * @requires OST-API.service:apiAuth
 * @requires OST-API.constant:PUBLIC_ROUTES
 */
angular.module('OSTApp')
.controller('LoginCtrl', function ($scope, apiAuth, $location, PUBLIC_ROUTES) {
  var self = this;

  /**
   * @ngdoc property
   * @name OSTApp.controller:LoginCtrl#displayError
   * @propertyOf OSTApp.controller:LoginCtrl
   *
   * @description
   * Stores the service error if any
   *
   * @returns {APIError} The {@link OST-API.type:APIError APIError}
   */
  this.displayError = null;

  /**
   * @ngdoc method
   * @name OSTApp.controller:LoginCtrl#registration
   * @methodOf OSTApp.controller:LoginCtrl
   *
   * @description
   * Handles the call of register on {@link OST-API.service:apiAuth#register apiAuth}
   * After the registration success, the functions automatically calls to
   * {@link OSTApp.controller:LoginCtrl#signin sign in}
   *
   * @param {Object} user The username, password, name and email of the user
   */
  this.registration = function (user) {
    self.displayError = '';

    // Just execute the logic if the user contains all the data
    if (angular.equals(user, {})) {
      return false;
    }

    return apiAuth.register(user.username, user.password, user.name, user.email)
    .then(function () {
      return self.signin(user);
    }, function (err) {
      self.displayError = err;
    });
  };

  /**
   * @ngdoc method
   * @name OSTApp.controller:LoginCtrl#signin
   * @methodOf OSTApp.controller:LoginCtrl
   *
   * @description
   * Handles the call of login on {@link OST-API.service:apiAuth#login login}
   * After the login success, the functions automatically redirects to
   * the {@link OSTApp.service:PUBLIC_ROUTES#HOME home} route
   *
   * @param {Object} user The username and password of the user
   */
  this.signin = function (user) {
    self.displayError = '';

    // Just execute the logic if the user contains all the data
    if (!user || angular.equals(user, {})) {
      return false;
    }

    return apiAuth.login(user.username, user.password)
    .then(function () {
      $location.path(PUBLIC_ROUTES.HOME);
    }, function (err) {
      self.displayError = err;
    });
  };
});
