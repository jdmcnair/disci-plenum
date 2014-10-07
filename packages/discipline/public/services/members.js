'use strict';

//Members service used for members REST endpoint
angular.module('mean.discipline').factory('MemberChores', ['$resource',
  function($resource) {
    return $resource('members/chores', { }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
