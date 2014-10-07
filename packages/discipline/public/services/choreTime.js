'use strict';

angular.module('mean.discipline').factory('ChoreTime', ['$resource',
  function($resource) {
    return $resource('choreTimes/:choreTimeId', {
      choreTimeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);


