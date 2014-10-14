'use strict';

angular.module('mean.family-admin').controller('FamilyAdminController', ['$scope', '$location', 'Global', 'FamilyAdmin', 'Members',
  function($scope, $location, Global, FamilyAdmin, Members) {
    $scope.global = Global;

    $scope.hasAuthorization = function(member) {
      if (!member || !member.createdByUser) return false;
      return $scope.global.isAdmin || member.createdByUser._id === $scope.global.user._id;
    };

    $scope.package = {
      name: 'family-admin'
    };

    $scope.find = function() {
      Members.query(function(members) {
        $scope.members = members;
      });
    };

    $scope.remove = function(member) {
      if (member) {
        member.$remove();

        for (var i in $scope.members) {
          if ($scope.members[i] === member) {
            $scope.members.splice(i, 1);
          }
        }
      } else {
        $scope.member.$remove(function(response) {
          $location.path('members');
        });
      }
    };
  }
]);
