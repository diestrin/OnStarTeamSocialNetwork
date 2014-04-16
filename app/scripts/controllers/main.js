'use strict';

angular.module('OSTApp')
.controller('MainCtrl', function (apiFeed, $rootScope) {
  var self = this;

  this.newPost = null;

  this.displayError = null;

  this.feed = [];

  apiFeed.getFeed()
  .then(function (posts) {
    self.feed = posts;
  });

  $rootScope.$on(apiFeed.EVENT_NEW_POST, function (e, post) {
    self.feed.push(post);
  });

  this.post = function (post) {
    this.displayError = null;

    return apiFeed.post(post)
    .then(function () {
      self.newPost = null;
    }, function (err) {
      self.displayError = err;
    });
  };
});
