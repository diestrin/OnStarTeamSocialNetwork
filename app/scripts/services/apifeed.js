'use strict';

/**
 * @ngdoc type
 * @name OST-API.type.Post
 *
 * @description
 * An post object
 *
 * ```js
    {
      "id": "The unique ID of the post",
      "user": "THe username of the author",
      "post": "The content of the post",
      "date": "The timestamp date in milliseconds"
    }
 * ```
 */

/**
 * @ngdoc service
 * @name OST-API.service:apiFeed
 *
 * @description
 * This service handles the feed and posts of all the user and its friends
 * The feed is conformed by the the posts of all the user friends and its own
 * posts
 *
 * @requires ng.$q
 * @requires ng.$rootScope
 * @requires OST-API.service:apiAuth
 * @requires OST-API.service:apiUsers
 * @requires OST-API.service:apiFriends
 * @requires OST-API.service:MemoryAdapter
 */
angular.module('OST-API')
.factory('apiFeed', function (apiAuth, MemoryAdapter, $q, apiUsers, apiFriends, $rootScope) {
  var Feed, posts;

  /**
   * @ngdoc event
   * @name OST-API.service:apiFeed#OST-API_Feed_New_Post
   * @eventOf OST-API.service:apiFeed
   * @eventType broadcast on root scope
   *
   * @description
   * Event triggered when when a new post is created
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {Post} user The new {@link OST-API.type.Post post}
   */

  Feed = {
    /**
     * @ngdoc property
     * @name OST-API.service:apiFeed#ERROR_POST_NOT_FOUND
     * @propertyOf OST-API.service:apiFeed
     *
     * @description
     * Used when an post can't be found
     *
     * @return {APIError} The corresponding {@link OST-API.type.APIError APIError}
     */
    ERROR_POST_NOT_FOUND: {
      description: 'The post couldn\'t be found'
    },

    /**
     * @ngdoc property
     * @name OST-API.service:apiFeed#EVENT_NEW_POST
     * @propertyOf OST-API.service:apiFeed
     *
     * @description
     * Event key triggered when a new post is created
     *
     * @return {string} The event key
     */
    EVENT_NEW_POST: 'OST-API_Feed_New_Post'
  };

  posts = MemoryAdapter.get('OST-API:Feed:posts') || {};

  // Collect the post form a single username
  // ** This method is registered in auth for test purposes
  Feed.__collectPostsFromUsers = function (username) {
    var userPosts = [];

    angular.forEach(posts, function (post) {
      if (post.user === username) {
        userPosts.push(post);
      }
    });

    return userPosts;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiFeed#post
   * @methodOf OST-API.service:apiFeed
   *
   * @description
   * Creates a new post and attach it to the current user in session
   *
   * @returns {Promise} The promise to be resolved with the new
   *                        {@link OST-API.type.Post post}
   */
  Feed.post = function (post) {
    var timeStamp, currentUser, deferred, newPost;

    deferred = $q.defer();
    timeStamp = new Date().getTime();
    currentUser = apiAuth.getCurrentUser();

    newPost = {
      id: 'p' + timeStamp,
      user: currentUser.username,
      post: post,
      date: timeStamp
    };

    posts[newPost.id] = newPost;

    MemoryAdapter.set('OST-API:Feed:posts', posts);

    $rootScope.$broadcast(Feed.EVENT_NEW_POST, newPost);
    deferred.resolve(newPost);

    return deferred.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiFeed#getPost
   * @methodOf OST-API.service:apiFeed
   *
   * @description
   * Creates a new post and attach it to the current user in session
   *
   * @param   {string}  id  The id of the post
   * @returns {Promise}     The promise to be resolved with the
   *                            {@link OST-API.type.Post post}
   */
  Feed.getPost = function (id) {
    var deferred;

    deferred = $q.defer();

    if (id in posts) {
      deferred.resolve(posts[id]);
    } else {
      deferred.reject(Feed.ERROR_POST_NOT_FOUND);
    }

    return deferred.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiFeed#getUserPosts
   * @methodOf OST-API.service:apiFeed
   *
   * @description
   * Return all the posts from a single username
   *
   * @param   {string}  username  The username
   * @returns {Promise}           The promise to be resolved with the
   *                                  {@link OST-API.type.Post post}
   */
  Feed.getUserPosts = function (username) {
    var deferred, userPosts;

    deferred = $q.defer();
    userPosts = [];

    if (username) {
      apiUsers.getUser(username)
      .then(function (user) {
        userPosts = Feed.__collectPostsFromUsers(user.username);
        deferred.resolve(userPosts);
      }, deferred.reject);
    } else {
      userPosts = Feed.__collectPostsFromUsers(apiAuth.getCurrentUser().username);
      deferred.resolve(userPosts);
    }

    return deferred.promise;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:apiFeed#getFeed
   * @methodOf OST-API.service:apiFeed
   *
   * @description
   * Get all the feed of the current user, this means his posts and the friends'
   * posts
   *
   * @returns {Promise} The promise to be resolved with the
   *                        {@link OST-API.type.Post post}
   */
  Feed.getFeed = function () {
    var deferred, currentUser;

    deferred = $q.defer();
    currentUser = apiAuth.getCurrentUser();

    apiFriends.getUserFriends(currentUser.username)
    .then(function (friends) {
      var postsQueue;

      postsQueue = [];

      postsQueue.push(Feed.getUserPosts());

      angular.forEach(friends, function (friend, friendUserName) {
        postsQueue.push(Feed.getUserPosts(friendUserName));
      });

      return $q.all(postsQueue);
    })
    .then(function (friendsPosts) {
      var posts = [];

      angular.forEach(friendsPosts, function (friendPosts) {
        angular.forEach(friendPosts, function (post) {
          posts.push(post);
        });
      });

      deferred.resolve(posts);
    }, deferred.reject);

    return deferred.promise;
  };

  return Feed;
});
