'use strict';

/**
 * @ngdoc controller
 * @name OSTApp.controller:NavbarCtrl
 *
 * @description
 * The controller of the navbar section.
 * Handles things like the logout, and search.
 *
 * @requires ng.$scope
 * @requires ng.$location
 * @requires OST-API.service:apiAuth
 * @requires OST-API.service:apiUsers
 * @requires OST-API.constant:PUBLIC_ROUTES
 */
angular.module('OSTApp')
.controller('NavbarCtrl', function ($scope, apiAuth, $location, PUBLIC_ROUTES, apiUsers) {
  var self = this;

  // Listener for successful login to store the new user data
  $scope.$on(apiAuth.EVENT_LOGIN_SUCCESS, function (e, user) {
    self.user = user;
  });

  // Listener for successful logout to remove the user data
  $scope.$on(apiAuth.EVENT_LOGOUT_SUCCES, function () {
    self.user = null;
  });

  $scope.$watch('Navbar.searchUser', function (value) {
    self.search(value);
  });

  /**
   * @ngdoc property
   * @name OSTApp.controller:NavbarCtrl#user
   * @propertyOf OSTApp.controller:NavbarCtrl
   *
   * @description
   * Stores the current user and use it to show the information
   * in the navbar
   *
   * @returns {User} The {@link OST-API.type.User User}
   */
  this.user = apiAuth.getCurrentUser();

  /**
   * @ngdoc method
   * @name OSTApp.controller:NavbarCtrl#logout
   * @methodOf OSTApp.controller:NavbarCtrl
   *
   * @description
   * Handles the call of logout on {@link OST-API.service:apiAuth#logout apiAuth}
   * After the logout success, the functions automatically redirects to
   * the {@link OSTApp.service:PUBLIC_ROUTES#LOGIN login} route
   *
   * @param {Object} user The username, password, name and email of the user
   */
  this.logout = function () {
    return apiAuth.logout()
    .then(function () {
      $location.path(PUBLIC_ROUTES.LOGIN);
    });
  };

  this.search = function (value) {
    apiUsers.searchUser(value)
    .then(function (results) {
      self.searchResult = results;
    });
  };

  this.goToResult = function (result) {
    $location.path(PUBLIC_ROUTES.USER + result.username);
  };
});
