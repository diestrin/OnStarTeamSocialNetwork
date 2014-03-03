'use strict';

angular.module('OSTApp', [
  'OST-API',
  'ngSanitize',
  'ngRoute'
])

.run(function (apiAuth) {
  /* jshint unused: false */
  // It's required to include the apiAuth service
  // in the run method to initialize the service
  // as soon as the application starts and get
  // the redirection of the auth policy working
})

.config(function ($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    controllerAs: 'Main',
    authPolicy: 'USER_STATUS_AUTH',
    onAuthPolicyFails: '/login'
  })

  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'Login',
    authPolicy: 'USER_STATUS_GUEST',
    onAuthPolicyFails: '/'
  })

  .otherwise({
    redirectTo: '/'
  });
});
