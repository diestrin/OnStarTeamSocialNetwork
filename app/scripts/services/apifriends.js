'use strict';

/**
 * @ngdoc service
 * @name OST-API.service:apiFriends
 *
 * @description
 * This service handles the feed and posts of all the user and its friends
 * The feed is conformed by the the posts of all the user friends and its own
 * posts
 *
 * @requires ng.$q
 * @requires OST-API.service:apiUsers
 */
angular.module('OST-API')
.factory('apiFriends', function ($q, apiUsers, apiAuth) {
  var Friends;

  Friends = {};

  /**
   * @ngdoc function
   * @name OST-API.service:apiFriends#getUserFriends
   * @methodOf OST-API.service:apiFriends
   *
   * @description
   * Get all the friends from a username
   *
   * @returns {Promise} The promise to be resolved with an array of
   *                        {@link OST-API.type.User users}
   */
  Friends.getUserFriends = function (username) {
    var deferred;

    deferred = $q.defer();

    apiUsers.getUser(username)
    .then(function (user) {
      var friendsQueue;

      friendsQueue = {};

      angular.forEach(user.friends, function (friend) {
        friendsQueue[friend] = apiUsers.getUser(friend);
      });

      return $q.all(friendsQueue);
    })
    .then(deferred.resolve, deferred.reject);

    return deferred.promise;
  };

  Friends.addFriend = function (friendUserName) {
    var currentUser;

    currentUser = apiAuth.getCurrentUser();
    currentUser.friends.push(friendUserName);

    return apiUsers.updateUser(currentUser);
  };

  Friends.removeFriend = function (friendUserName) {
    var currentUser, friendIndex;

    currentUser = apiAuth.getCurrentUser();
    friendIndex = currentUser.friends.indexOf(friendUserName);
    currentUser.friends.splice(friendIndex, 1);

    return apiUsers.updateUser(currentUser);
  };

  return Friends;
});
