'use strict';

/**
 * @ngdoc type
 * @name OST-API.type.UserStatus
 *
 * @description
 * An user status inside the application
 *
 * ```js
    {
      "name": "Human name of the user status"
    }
 * ```
 */

/**
 * @ngdoc service
 * @name OST-API.service:apiAuth
 *
 * @description
 * This service handles the authentication layer of the application
 * and registration of new users to the system.
 *
 * @requires ng.$q
 * @requires ng.$rootScope
 * @requires ng.$location
 * @requires ngRoute.$route
 * @requires OST-API.service:MemoryAdapter
 * @requires OST-API.service:apiUsers
 */
angular.module('OST-API')
.factory('apiAuth', function ($q, MemoryAdapter, $route, $rootScope, $location, apiUsers) {
  var auth, currentUser, currentUserStatus;

  /**
   * @ngdoc event
   * @name OST-API.service:apiAuth#OST-API_Auth_Login_success
   * @eventOf OST-API.service:apiAuth
   * @eventType broadcast on root scope
   *
   * @description
   * Event triggered when an user has been authenticated
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {Object} user The new user in session
   */

  /**
   * @ngdoc event
   * @name OST-API.service:apiAuth#OST-API_Auth_Logout_success
   * @eventOf OST-API.service:apiAuth
   * @eventType broadcast on root scope
   *
   * @description
   * Event key triggered when the active user has been removed form session
   *
   * @param {Object} angularEvent Synthetic event object.
   */

  // auth is the public API exposed by the service
  auth = {
    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#USER_STATUS_GUEST
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * The status of a non authenticated user
     *
     * @return {UserStatus} The corresponding {@link OST-API.type.UserStatus UserStatus}
     */
    USER_STATUS_GUEST: {
      name: 'guest'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#USER_STATUS_AUTH
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * The status of an authenticated user
     *
     * @return {UserStatus} The corresponding {@link OST-API.type.UserStatus UserStatus}
     */
    USER_STATUS_AUTH: {
      name: 'auth'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#ERROR_LOGIN_INVALID_USERNAME
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Used when an invalid username is provided
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_LOGIN_INVALID_USERNAME: {
      description: 'Invalid username'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#ERROR_LOGIN_INVALID_PASSWORD
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Used when an invalid password for the username is provided
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_LOGIN_INVALID_PASSWORD: {
      description: 'Invalid password'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#ERROR_LOGIN_USER_IN_SESSION
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Used when an user is already in session
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_LOGIN_USER_IN_SESSION: {
      description: 'A user is already in session'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#ERROR_LOGOUT_NO_USER_IN_SESSION
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Used when there is no user in session
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_LOGOUT_NO_USER_IN_SESSION: {
      description: 'No existing user in session'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#ERROR_REGISTER_USER_ALREADY_EXISTS
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Used when there the user to be registered already exists
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_REGISTER_USER_ALREADY_EXISTS: {
      description: 'The user already exists'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#EVENT_LOGIN_SUCCESS
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Event key triggered when an user has been authenticated
     *
     * @return {string} The event key
     */
    EVENT_LOGIN_SUCCESS: 'OST-API_Auth_Login_success',

    /**
     * @ngdoc property
     * @name OST-API.service:apiAuth#EVENT_LOGOUT_SUCCESS
     * @propertyOf OST-API.service:apiAuth
     *
     * @description
     * Event key triggered when the active user has been removed form session
     *
     * @return {string} The event key
     */
    EVENT_LOGOUT_SUCCESS: 'OST-API_Auth_Logout_success'
  };

  // Restore the current user if any
  currentUser = MemoryAdapter.get('OST-API:Auth:currentUser') || null;

  $rootScope.$on(apiUsers.EVENT_USER_UPDATED, function (e, user) {
    if (user.username === currentUser.username) {
      currentUser = user;
      MemoryAdapter.set('OST-API:Auth:currentUser', currentUser);
    }
  });

  // Define for the first time the current user status
  currentUserStatus = currentUser === null ?
    auth.USER_STATUS_GUEST : auth.USER_STATUS_AUTH;

  // Handles the update on the route to match the
  // auth policy declared on the $routeProvider configuration
  $rootScope.$on('$routeChangeSuccess', function () {
    if ($route.current.$$route.authPolicy &&
      !auth.__isCurrentStatusOnPolicy($route.current.$$route.authPolicy)) {

      $location.path($route.current.$$route.onAuthPolicyFails);
    }
  });

  // Verify if this route is allow in the policy
  // ** This method is registered in auth for test purposes
  auth.__isCurrentStatusOnPolicy = function (policy) {
    var isAllow = true;

    if (auth.getCurrentUserStatus() !== auth[policy]) {
      isAllow = false;
    }

    return isAllow;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiAuth#getCurrentUser
   * @methodOf OST-API.service:apiAuth
   *
   * @description
   * Gets the current user
   * ```json
      {
        "name": "Human user name",
        "username": "Username",
        "email": "The user's email"
      }
   * ```
   *
   * @returns {object} The current user
   */
  auth.getCurrentUser = function () {
    var __currentUser = null;

    if (currentUser) {
      __currentUser = angular.copy(currentUser);
      delete __currentUser.__password;
    }

    return __currentUser;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiAuth#getCurrentUserStatus
   * @methodOf OST-API.service:apiAuth
   *
   * @description
   * Gets the current user status
   * - {@link OST-API.service:apiAuth#USER_STATUS_GUEST Guest}
   * - {@link OST-API.service:apiAuth#USER_STATUS_AUTH Auth}
   *
   * @returns {UserStatus} The corresponding {@link OST-API.type.UserStatus}
   */
  auth.getCurrentUserStatus = function () {
    currentUserStatus = currentUser ?
      auth.USER_STATUS_AUTH : auth.USER_STATUS_GUEST;

    return currentUserStatus;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiAuth#logout
   * @methodOf OST-API.service:apiAuth
   *
   * @description
   * Logout a user in session
   *
   * @returns {Promise} The promise to be resolved
   */
  auth.logout = function () {
    var deferrer;

    deferrer = $q.defer();

    if (currentUser) {
      currentUser = null;
      MemoryAdapter.remove('OST-API:Auth:currentUser');
      deferrer.resolve();
      $rootScope.$broadcast(auth.EVENT_LOGOUT_SUCCESS);

    } else {
      deferrer.reject(auth.ERROR_LOGOUT_NO_USER_IN_SESSION);
    }

    return deferrer.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiAuth#login
   * @methodOf OST-API.service:apiAuth
   *
   * @description
   * Login an existing user
   *
   * @param  {string}  username The username
   * @param  {string}  password The password
   * @return {Promise}          The promise to be resolved
   */
  auth.login = function (username, password) {
    var deferrer;

    deferrer = $q.defer();

    // Ensure there's no user in session
    if (currentUser) {
      deferrer.reject(auth.ERROR_LOGIN_USER_IN_SESSION);

    // Ensure there's an user registered with that username
    // store the user in the variable, the single equal is
    // intentional
    } else {
      apiUsers.getUser(username)
      .then(function (user) {

        if (user.__password === password) {
          currentUser = user;
          MemoryAdapter.set('OST-API:Auth:currentUser', user);
          deferrer.resolve(user);
          $rootScope.$broadcast(auth.EVENT_LOGIN_SUCCESS, user);

        } else {
          deferrer.reject(auth.ERROR_LOGIN_INVALID_PASSWORD);
        }
      }, deferrer.reject);
    }

    return deferrer.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiAuth#register
   * @methodOf OST-API.service:apiAuth
   *
   * @description
   * Register a new user
   *
   * @param  {string}  username The username
   * @param  {string}  password The password
   * @param  {string}  name     The name
   * @param  {string}  email    The email
   * @return {Promise}          The promise to be resolved
   */
  auth.register = function (username, password, name, email) {
    var deferrer = $q.defer();

    // Search the username in the registry
    apiUsers.getUser(username)
    .then(function () {
      deferrer.reject(auth.ERROR_REGISTER_USER_ALREADY_EXISTS);
    }, function () {
      return apiUsers.addUser({
        __password: password,
        username: username,
        name: name,
        email: email,
        friends: []
      })
      .then(deferrer.resolve, deferrer.reject);
    });

    return deferrer.promise;
  };

  // Public API here
  return auth;
});
