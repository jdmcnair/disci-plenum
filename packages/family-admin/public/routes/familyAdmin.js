'use strict';

angular.module('mean.family-admin').config(['$stateProvider',
  function($stateProvider) {

    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $stateProvider.state('FamAdmin', {
      url: '/familyAdmin/example',
      templateUrl: 'family-admin/views/index.html'
    })
      .state('create member', {
        url: '/familyAdmin/members/create',
        templateUrl: 'family-admin/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit member', {
        url: '/members/:memberId/edit',
        templateUrl: 'family-admin/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('member by id', {
        url: '/members/:memberId',
        templateUrl: 'family-admin/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
