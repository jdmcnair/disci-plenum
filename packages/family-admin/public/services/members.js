'use strict';

//Members service used for members REST endpoint
angular.module('mean.family-admin').factory('Members', ['$resource',
  function($resource) {
    return $resource('members/:memberId', {
      memberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
