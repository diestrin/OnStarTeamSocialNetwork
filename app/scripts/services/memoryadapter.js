'use strict';

/**
 * @ngdoc service
 * @name OST-API.service:MemoryAdapter
 *
 * @description
 * This service handles the storage strategy for the OST-API module
 */
angular.module('OST-API')
.service('MemoryAdapter', function MemoryAdapter ($window) {
  var strategy = 'local';

  var getStrategyAdapter = function () {
    return $window[strategy + 'Storage'];
  };

  /**
   * @ngdoc function
   * @name OST-API.service:MemoryAdapter#get
   * @methodOf OST-API.service:MemoryAdapter
   *
   * @description
   * Get a previous stored value
   *
   * @param  {string} key The key of the value stored
   * @return {string}     The old value stored
   */
  this.get = function (key) {
    var value = getStrategyAdapter().getItem(key);
    return value !== null ? angular.fromJson(value) : null;
  };

  /**
   * @ngdoc function
   * @name OST-API.service:MemoryAdapter#set
   * @methodOf OST-API.service:MemoryAdapter
   *
   * @description
   * Set a value to a key name
   *
   * @param  {string}               key   The key of the value that will be stored
   * @param  {string|number|object} value The value to be stored
   */
  this.set = function (key, value) {
    getStrategyAdapter().setItem(key, angular.toJson(value));
  };

  /**
   * @ngdoc function
   * @name OST-API.service:MemoryAdapter#remove
   * @methodOf OST-API.service:MemoryAdapter
   *
   * @description
   * Removes a previous stored value
   *
   * @param  {string} key The key to be deleted
   */
  this.remove = function (key) {
    getStrategyAdapter().removeItem(key);
  };

  /**
   * @ngdoc function
   * @name OST-API.service:MemoryAdapter#reset
   * @methodOf OST-API.service:MemoryAdapter
   *
   * @description
   * Delete all the values in the storage
   */
  this.reset = function () {
    getStrategyAdapter().clear();
  };
});
