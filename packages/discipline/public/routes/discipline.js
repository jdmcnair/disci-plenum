'use strict';

angular.module('mean.discipline').config(['$stateProvider',
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

    // Check if the user is connected
    var checkFamilyMembership = function($q, $timeout, $http, $location, Global) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/familyMember').success(function(member) {
        Global.member = member;

        // family member
        if (member && member.family) {
          $timeout(deferred.resolve);
        }

        // Not family member
        else {
          $timeout(deferred.reject);
          $location.url('/familyAdmin/setup');
        }
      });

      return deferred.promise;
    };  
    
    $stateProvider.state('Discipline', {
      url: '/discipline/index',
      templateUrl: 'discipline/views/index.html',
      resolve: {
        loggedin: checkLoggedin,
        checkFamilyMembership: checkFamilyMembership
      }
    })
  	.state('create choreTime', {
  		url: '/discipline/create/:memberId',
  		templateUrl: 'discipline/views/create.html',
  		resolve: {
  		  loggedin: checkLoggedin,
        checkFamilyMembership: checkFamilyMembership
  		}
  	});
  }
]);
