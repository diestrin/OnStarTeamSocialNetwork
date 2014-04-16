'use strict';

/**
 * @ngdoc type
 * @name OST-API.type.User
 *
 * @description
 * An user object with the parameters
 *
 * ```js
    {
      "username": "The username key",
      "password": "For registration and authentication purposes.", // Optional
      "email": "The email",
      "name": "The name",
      "friends": ["username1", "username2"]
    }
 * ```
 */

/**
 * @ngdoc service
 * @name OST-API.service:apiUsers
 *
 * @description
 * This service handles the user management of the application.
 * It adds, update and retrieve the users to the OST-API services
 * that need it.
 * *Don't* use this service at least that you know what you're doing.
 *
 * @requires ng.$q
 * @requires ng.$filter
 * @requires OST-API.service:MemoryAdapter
 */
angular.module('OST-API')
.factory('apiUsers', function (MemoryAdapter, $q, $filter, $rootScope) {
  var Users, users, filter;

  filter = $filter('filter');

  Users = {
    /**
     * @ngdoc property
     * @name OST-API.service:apiUsers#ERROR_USERS_INVALID_USERNAME
     * @propertyOf OST-API.service:apiUsers
     *
     * @description
     * Used when an invalid username is provided in an operation that requires one
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_USER_NOT_FOUND: {
      description: 'Invalid username in operation'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiUsers#ERROR_USER_ALREADY_EXISTS
     * @propertyOf OST-API.service:apiUsers
     *
     * @description
     * Used when an operation related with the creation of a new user founds the
     * user already exists
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_USER_ALREADY_EXISTS: {
      description: 'The user already exists'
    },

    EVENT_USER_UPDATED: 'OST-API_Users_User_updated'
  };

  // Restore the list of users if any
  users = MemoryAdapter.get('OST-API:Users:users') || {};

  // Convert the user data into a public user data, this means without password
  // ** This method is registered in auth for test purposes
  Users.__getPublicUserData = function (privateUser) {
    var publicUser;

    publicUser = angular.copy(privateUser);
    delete publicUser.__password;

    return publicUser;
  };

  // Convert the user data of all users into public data
  // ** This method is registered in auth for test purposes
  Users.__getPublicUsersData = function () {
    var publicUsersData;

    publicUsersData = {};

    angular.forEach(users, function (user, username) {
      publicUsersData[username] = Users.__getPublicUserData(user);
    });

    return publicUsersData;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiUsers#addUser
   * @methodOf OST-API.service:apiUsers
   *
   * @description
   * Add a user new to the records
   *
   * @param  {User}    user The {@link OST-API.type.User user} object to add
   * @return {Promise}      To be resolved with the {@link OST-API.type.User User}
   *                           or rejected with the {@link OST-API.type.APIError APIError}
   */
  Users.addUser = function (user) {
    var deferred = $q.defer();

    if (user.username in users) {
      deferred.reject(Users.ERROR_USER_ALREADY_EXISTS);
    } else {
      users[user.username] = angular.copy(user);
      MemoryAdapter.set('OST-API:Users:users', users);
      deferred.resolve(user);
    }

    return deferred.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiUsers#updateUser
   * @methodOf OST-API.service:apiUsers
   *
   * @description
   * Update an existing user. The user is going to be merged with angular.extend()
   *
   * @param  {User}    user The {@link OST-API.type.User user} object to add
   * @return {Promise}      To be resolved with the {@link OST-API.type.User User}
   *                           or rejected with the {@link OST-API.type.APIError APIError}
   */
  Users.updateUser = function (user) {
    var deferred, newUser;

    deferred = $q.defer();

    if (user.username in users) {
      newUser = users[user.username];
      newUser = angular.extend(newUser, user);
      MemoryAdapter.set('OST-API:Users:users', users);
      $rootScope.$broadcast(Users.EVENT_USER_UPDATED, newUser);
      deferred.resolve(angular.copy(newUser));
    } else {
      deferred.reject(Users.ERROR_USER_NOT_FOUND);
    }

    return deferred.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiUsers#getUser
   * @methodOf OST-API.service:apiUsers
   *
   * @description
   * Update an existing user. The user is going to be merged with angular.extend()
   *
   * @param  {string}  username The username only
   * @return {Promise}          To be resolved with the {@link OST-API.type.User User}
   *                               or rejected with the {@link OST-API.type.APIError APIError}
   */
  Users.getUser = function (username) {
    var deferred;

    deferred = $q.defer();

    if (username in users) {
      deferred.resolve(angular.copy(users[username]));
    } else {
      deferred.reject(Users.ERROR_USER_NOT_FOUND);
    }

    return deferred.promise;
  };

  Users.searchUser = function (criteria) {
    var deferred, matchedUsers;

    deferred = $q.defer();
    matchedUsers = filter(Users.__getPublicUsersData(), criteria);

    deferred.resolve(matchedUsers);

    return deferred.promise;
  };

  return Users;
});
