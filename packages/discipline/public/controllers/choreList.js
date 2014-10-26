/*global _:false */

'use strict';

angular.module('mean.discipline').controller('ChoreListController', 
	['$scope', '$location', '$stateParams', '$http', 'Global', 'Discipline', 'Members', 'ChoreList',
  function($scope, $location, $stateParams, $http, Global, Discipline, Members, ChoreList) {
    $scope.global = Global;
    $scope.package = {
      name: 'discipline'
    };

    	console.log('ChoreListController');


    function parentOrAdmin() {
      return $scope.global.isAdmin || $scope.global.member.isParent;
    }

    $scope.parentOrAdmin = parentOrAdmin;    

    $scope.findMemberList = function() {
    	console.debug('findMemberList');

      var memberId = $stateParams.memberId;

      Members.get({ memberId: memberId }, function(member) {
        $scope.member = member;
      });

      // var list = ChoreList.get({ memberId: $stateParams.memberId }).then();

      // console.log(list);

      // $scope.choreList = list;

      ChoreList.get({ memberId: memberId }, function(choreList){
      	if(!choreList.null) { 
      		console.log(choreList);
      		$scope.choreList = choreList;
      	}
      	else {
          var choreList = new ChoreList({ learner: memberId, createdBy: $scope.global.user._id, tasks: [] });
          choreList.$save();

          $scope.choreList = choreList;

      		console.log('choreList null');
      	}
      });
    };

    // function saveList() {
    //   $scope.choreList.$save();      
    // }

    function updateListAndSave(preSaveCallback, task){        
      $scope.choreList.$get(function(choreList){
        if(task){
          var taskMatch = _.find(choreList.tasks, function(item){ 
            console.log('item: ' + item + ', task: ' + task);

            return item._id === task._id; 
          });
          console.log(taskMatch);
          preSaveCallback(choreList, taskMatch);
        } else {
          preSaveCallback(choreList);
        }
        choreList.$save();   
        $scope.choreList = choreList;
      });
    }

    $scope.addTask = function(isValid) {
      if (isValid) {
        var title = this.title;
        var description = this.description;

        updateListAndSave(function(newList){
          if(!newList.tasks) {
            newList.tasks = [];
          }
          newList.tasks.unshift({ title: title, description: description });
        });

        this.title = '';
        this.description = '';
        $scope.submitted = false;
      } else {
        $scope.submitted = true;
      }
    };

    $scope.removeTask = function(task){
      updateListAndSave(function(newList, newTask){
        var index = newList.tasks.indexOf(newTask);
        newList.tasks.splice(index, 1);
      }, task);
    };    

    $scope.toggleTask = function(task){
      var completed = !task.completed; 
      updateListAndSave(function(newList, newTask){
        if(newTask){
          newTask.completed = completed;
        }
      }, task);
    };

    $scope.toggleTaskAcceptance = function(task){
      var verifyingTeacher = null;
      var completed = false;

      if(!task.verifyingTeacher){
        verifyingTeacher = $scope.global.user._id; 
        completed = true;
      }

      updateListAndSave(function(newList, newTask){
        if(newTask){
          newTask.verifyingTeacher = verifyingTeacher;
          newTask.completed = completed;
        }
      }, task);
    };
}]);