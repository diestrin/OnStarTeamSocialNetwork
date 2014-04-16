'use strict';

/**
 * @ngdoc module
 * @name OST-API
 *
 * @description
 * The OST-API module to provide the low-level
 * API for the {@link OSTApp}
 */
angular.module('OST-API', [
  'ngRoute'
]);

/**
 * @ngdoc type
 * @name OST-API.type.APIError
 *
 * @description
 * An API error with the human description
 *
 * ```json
    {
      "description": "Human description"
    }
 * ```
 */
