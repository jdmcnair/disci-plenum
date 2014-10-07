'use strict';

angular.module('mean.family-admin').controller('MembersController', ['$scope', '$stateParams', '$location', 'Global', 'FamilyAdmin', 'Members',
  function($scope, $stateParams, $location, Global, FamilyAdmin, Members) {
    $scope.global = Global;

    $scope.hasAuthorization = function(member) {
      if (!member || !member.user) return false;
      return $scope.global.isAdmin || member.user._id === $scope.global.user._id;
    };
    
    $scope.package = {
      name: 'family-admin'
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var member = new Members({
          name: this.name
        });
        member.$save(function(response) {
          //$location.path('/familyAdmin/members/' + response._id);
          $location.path('/familyAdmin/example');
        });

        this.name = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.findOne = function() {
      Members.get({
        memberId: $stateParams.memberId
      }, function(member) {
        $scope.member = member;
      });
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var member = $scope.member;
        if (!member.updated) {
          member.updated = [];
        }
        member.updated.push(new Date().getTime());

        member.$update(function() {
          $location.path('members/' + member._id);
        });
      } else {
        $scope.submitted = true;
      }
    };
  }
]);
