'use strict';

angular.module('OSTApp', [
  'OST-API',
  'ngSanitize',
  'ngRoute'
])

.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});
