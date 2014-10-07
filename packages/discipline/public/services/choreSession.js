'use strict';

//Members service used for members REST endpoint
angular.module('mean.discipline').factory('ChoreSessions', ['$resource',
  function($resource) {
    return $resource('choreSessions/:memberId', {
    	memberId: '@memberId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
