'use strict';

/**
 * @ngdoc filter
 * @name OSTApp.filter:jsonToArray
 * @function
 *
 * @description
 * Transform an json object into an array, removing the keys
 *
 * @param {Object} input  The object to convert
 * @return {Array}        The object without the keys
 *
 * @example
   <doc:example>
     <doc:source>
       <div ng-init="foo = {a: 2, b: 3}">
         {{ foo | jsonToArray }}
       </div>
     </doc:source>
   </doc:example>
 */
angular.module('OSTApp')
.filter('jsonToArray', function () {
  return function (input) {
    var output = [];

    angular.forEach(input, function (value) {
      output.push(value);
    });

    return output;
  };
});
