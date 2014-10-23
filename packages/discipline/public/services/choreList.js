'use strict';

angular.module('mean.discipline').factory('ChoreList', ['$resource',
  function($resource) {
    return $resource('choreList/:memberId', {
      memberId: '@learner'
    }, {
      save: {
        method: 'PUT'
      },
      get: {
      	method: 'GET',
      	isArray: false,
      	transformResponse: function(data, headersGetter){
      		//console.log('transformResponse: ' + data);

      		if(data === 'null'){
      			console.log('in null area');
      			return { null: true };
      		}
      		return angular.fromJson(data);
      	}
      }
    });
  }
]);


