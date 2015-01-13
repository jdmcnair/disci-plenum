'use strict';

angular.module('mean.discipline').controller('DisciplineController', ['$scope', '$location', '$stateParams', '$http', '$interval', 'Global', 'Discipline', 'ChoreTime', 'Members', 'MemberChores', 'ChoreSessions',
  function($scope, $location, $stateParams, $http, $interval, Global, Discipline, ChoreTime, Members, MemberChores, ChoreSessions) {
    $scope.global = Global;
    $scope.package = {
      name: 'discipline'
    };

    $scope.timestamp = 0;

    $interval(function(){
      $scope.timestamp = new Date().getTime();   
    }, 30000);

    function parentOrAdmin() {
      return $scope.global.isAdmin || $scope.global.member.isParent;
    }

    $scope.parentOrAdmin = parentOrAdmin;

    $scope.hasAuthorization = function(member) {
      if (!member) return false;
      return parentOrAdmin() || $scope.global.member._id === member._id;
    };

    $scope.choreReasons = ['Disobedience', 'Grades', 'Attitude', 'Disrespect', 'Negativity', 'Lying', 'Carelessness']; //, 'Lack of Accountability'];

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
    //console.log(a + ' b: ' + b.remainingDuration);
		return a + b.remainingDuration;
	}

    $scope.hasChoreAuthorization = function(choreTime) {
      if (!choreTime || !choreTime.teacher) return false;
      return $scope.global.isAdmin || choreTime.teacher._id === $scope.global.user._id;
    };

    function createChoreTime(memberId, secondsDuration, reason, callback) {
      var choreTime = new ChoreTime({
        reason: reason,
        secondsDuration: secondsDuration,
        learner: memberId
      });
      choreTime.$save(function(response) {
        callback();
      });      
    }

    $scope.create = function(isValid) {
      if (isValid) {
        createChoreTime($scope.member._id, this.secondsDuration, this.reason, function(){
          $location.path('discipline/index');
        });

        this.reason = '';
        this.secondsDuration = '';
      } else {
        $scope.submitted = true;
      }
    };	

    $scope.addStallingTime = function(memberId) {
      createChoreTime(memberId, 300, 'Stalling', loadMembers);
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

    $scope.subtractTimeAmount = function(member, minutesDuration) {
      console.log('bad test');

      var url = '/choreSessions/' + member._id + '/' + minutesDuration;

      $http.put(url, { memberId: member._id, subtractedDuration: minutesDuration }).
        success(function(data, status, headers, config) {
          loadMembers();
        }).
        error(function(data, status, headers, config) {
          loadMembers();
        });      
    };
  }
]);
