'use strict';

angular.module('mean.discipline').controller('DisciplineController', ['$scope', '$location', '$stateParams', 'Global', 'Discipline', 'ChoreTime', 'Members', 'MemberChores', 'ChoreSessions',
  function($scope, $location, $stateParams, Global, Discipline, ChoreTime, Members, MemberChores, ChoreSessions) {
    $scope.global = Global;
    $scope.package = {
      name: 'discipline'
    };

    $scope.choreReasons = ['Disobedience', 'Grades', 'Attitude'];
    $scope.durations = [
    	{ display: '5 minutes', value: 300 },
    	{ display: '10 minutes', value: 600 },
    	{ display: '15 minutes', value: 900 },
    	{ display: '30 minutes', value: 1800 },
    	{ display: '45 minutes', value: 2700 },
    	{ display: '1 hour', value: 3600 },
    	{ display: '1.5 hours', value: 5400 },
      { display: '2 hours', value: 7200 },
      { display: '4 hours', value: 14400 },
    	{ display: '6 hours', value: 21600 },
    ];

    function loadMembers(){
	    MemberChores.query(function(members){
	    	$scope.members = members;
	    });
    }

    loadMembers();

	ChoreTime.query(function(choreTimes) {
		$scope.choreTimes = choreTimes;
	});

	$scope.choreSum = function(member) {
		return member.choreTimes.reduce(sum, 0);
	};

	function sum(a,b){
    console.log(a + ' b: ' + b.remainingDuration);
		return a + b.remainingDuration;
	}

    $scope.hasAuthorization = function(choreTime) {
      if (!choreTime || !choreTime.teacher) return false;
      return $scope.global.isAdmin || choreTime.teacher._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var choreTime = new ChoreTime({
          reason: this.reason,
          secondsDuration: this.secondsDuration,
          learner: $scope.member._id
        });
        choreTime.$save(function(response) {
          $location.path('discipline/index'); // ' + response._id);
        });

        this.reason = '';
        this.secondsDuration = '';
      } else {
        $scope.submitted = true;
      }
    };	

    $scope.findMember = function() {
      Members.get({
        memberId: $stateParams.memberId
      }, function(member) {
        $scope.member = member;
      });
    };

    $scope.remove = function(choreTime) {
      if (choreTime) {
        choreTime.$remove();

        for (var i in $scope.choreTimes) {
          if ($scope.choreTimes[i] === choreTime) {
            $scope.choreTimes.splice(i, 1);
          }
        }
      } else {
        $scope.choreTime.$remove(function(response) {
          $location.path('discipline/index');
        });
      }
      loadMembers();
    };

    $scope.toggleActivity = function(member) {
      if (member.currentSession) {
        ChoreSessions.delete({
          memberId: member._id
        }, loadMembers);        
      } else {
        ChoreSessions.update({
          memberId: member._id
        }, loadMembers);      
      }
    };
  }
]);
