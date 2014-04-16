'use strict';

angular.module('OSTApp')
.controller('UserCtrl', function ($scope, $routeParams, apiUsers, apiAuth, apiFriends) {
  var self, currentUser;

  self = this;

  this.data = null;
  this.isUserFriend = false;
  this.isCurrentUser = false;

  currentUser = apiAuth.getCurrentUser();

  if (currentUser.friends.indexOf($routeParams.username) >= 0) {
    this.isUserFriend = true;
  }

  if (currentUser.username === $routeParams.username) {
    this.isCurrentUser = true;
  }

  apiUsers.getUser($routeParams.username)
  .then(function (user) {
    self.data = user;
  });

  this.addFriend = function () {
    apiFriends.addFriend($routeParams.username)
    .then(function () {
      self.isUserFriend = true;
    });
  };

  this.removeFriend = function () {
    apiFriends.removeFriend($routeParams.username)
    .then(function () {
      self.isUserFriend = false;
    });
  };
});
