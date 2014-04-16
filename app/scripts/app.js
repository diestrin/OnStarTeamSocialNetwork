'use strict';

/**
 * @ngdoc module
 * @name OSTApp
 *
 * @description
 * The OSTApp module that handles the logic of the main application
 */
angular.module('OSTApp', [
  'OST-API',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])

.run(function (apiAuth) {
  /* jshint unused: false */
  // It's required to include the apiAuth service
  // in the run method to initialize the service
  // as soon as the application starts and get
  // the redirection of the auth policy working
})

/**
 * @ngdoc service
 * @name OSTApp.service:PUBLIC_ROUTES
 * @type {Object}
 *
 * @description
 * Routes of all the public pages
 */
.constant('PUBLIC_ROUTES', {
  /**
   * @ngdoc property
   * @name OSTApp.service:PUBLIC_ROUTES#HOME
   * @propertyOf OSTApp.service:PUBLIC_ROUTES
   * @description The / route
   */
  HOME: '/',

  /**
   * @ngdoc property
   * @name OSTApp.service:PUBLIC_ROUTES#LOGIN
   * @propertyOf OSTApp.service:PUBLIC_ROUTES
   * @description The /login route
   */
  LOGIN: '/login',

  /**
   * @ngdoc property
   * @name OSTApp.service:PUBLIC_ROUTES#USER
   * @propertyOf OSTApp.service:PUBLIC_ROUTES
   * @description The /user/:user route
   */
  USER: '/user/'
})

.config(function ($routeProvider, PUBLIC_ROUTES) {
  $routeProvider

  .when(PUBLIC_ROUTES.HOME, {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    controllerAs: 'Main',
    authPolicy: 'USER_STATUS_AUTH',
    onAuthPolicyFails: PUBLIC_ROUTES.LOGIN
  })

  .when(PUBLIC_ROUTES.LOGIN, {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'Login',
    authPolicy: 'USER_STATUS_GUEST',
    onAuthPolicyFails: PUBLIC_ROUTES.HOME
  })

  .when(PUBLIC_ROUTES.USER + ':username', {
    templateUrl: 'views/user.html',
    controller: 'UserCtrl',
    controllerAs: 'User',
  })

  .otherwise({
    redirectTo: PUBLIC_ROUTES.HOME
  });
});
