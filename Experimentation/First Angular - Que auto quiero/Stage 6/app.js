var app = angular.module('app', ['ngRoute'])

  .factory('Todos', function(){
    return {
      getData : function () {
        var saved = localStorage.getItem('localS');
        var toddos = (localStorage.getItem('localS')!==null) ? JSON.parse(saved) : [ {name: 'Learnasdfsdfsdf AngularJS', done: true}, {name: 'Build ansadfsdfsdf Angular app', done: true} ];
        localStorage.setItem('localS', JSON.stringify(toddos));
        return toddos
      }
    };     
  })

  .controller('TodoController', ['$scope','Todos', function ($scope, Todos) {

    $scope.todos = Todos.getData();

    $scope.$watch('todos', function(newVal){
      var str = angular.toJson(newVal); 
      window.localStorage['localS'] = str; 
    }, true);

    $scope.update = function() {
      $scope.todos.push({
        name: $scope.todoText,
        done: false
      });
      $scope.todoText = '';
      localStorage.setItem('localS', JSON.stringify($scope.todos));
    }

    $scope.remove = function(index) { 
      $scope.todos.splice(index, 1);    
      localStorage.setItem('localS', JSON.stringify($scope.todos)); 
    }

    $scope.editing = null;

    $scope.editItem = function(item) {
      $scope.editing = item;
    }

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo){
        count+= todo.done ? 0 : 1;
      });
      return count;
    }

  }])
  
  .controller('TodoDetailCtrl', ['$scope', '$routeParams','Todos', function ($scope, $routeParams, Todos) {
    $scope.todo = Todos.getData()[$routeParams.id];
    $scope.todos = Todos.getData();

    $scope.$watch('todos', function(newVal){
      var str = angular.toJson(newVal); 
      window.localStorage['localS'] = str; 
    }, true);
  }])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/todos.html',
        controller: 'TodoController'
      })
    
      .when('/:id', {
        templateUrl: '/todoDetails.html',
        controller: 'TodoDetailCtrl',
      });
  }]);