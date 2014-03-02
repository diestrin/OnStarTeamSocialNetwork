'use strict';

/**
 * @ngdoc service
 * @name OST-API.service:apiAuth
 *
 * @description
 * This service handles the authentication layer of the application
 * and registration of new users to the system.
 *
 * @requires OST-API.service:MemoryAdapter
 */
angular.module('OST-API')
.factory('apiAuth', function ($q, MemoryAdapter) {
  var auth, users;

  auth = {
    // Restore the current user if any
    __currentUser: MemoryAdapter.get('OST-API:Auth:currentUser') || null,
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
    }
  };

  // Restore the list of users if any
  users = MemoryAdapter.get('OST-API:Auth:users') || {};

  auth.__getCurrentUser = function () {
    return auth.__currentUser;
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

    if (auth.__currentUser) {
      auth.__currentUser = null;
      MemoryAdapter.remove('OST-API:Auth:currentUser');
      deferrer.resolve();

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
    var user, deferrer;

    deferrer = $q.defer();

    // Ensure there's no user in session
    if (auth.__currentUser) {
      deferrer.reject(auth.ERROR_LOGIN_USER_IN_SESSION);

    // Ensure there's an user registered with that username
    } else if ((user = users[username])) {

      // Ensure the password is the same
      if (user.__password === password) {
        auth.__currentUser = user;
        MemoryAdapter.set('OST-API:Auth:currentUser', user);
        deferrer.resolve(user);

      } else {
        deferrer.reject(auth.ERROR_LOGIN_INVALID_PASSWORD);
      }

    } else {
      deferrer.reject(auth.ERROR_LOGIN_INVALID_USERNAME);
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
    if (!(username in users)) {
      users[username] = {
        __password: password,
        username: username,
        name: name,
        email: email
      };
      MemoryAdapter.set('OST-API:Auth:users', users);

      deferrer.resolve(users[username]);

    } else {
      deferrer.reject(auth.ERROR_REGISTER_USER_ALREADY_EXISTS);
    }

    return deferrer.promise;
  };

  // Public API here
  return auth;
});
