var app = angular.module('app', ['ngRoute'])

  app.factory('Todos', function(){
    return {
      getData : function () {
        var saved = localStorage.getItem('localT');
        var toddos = (localStorage.getItem('localT')!==null) ? JSON.parse(saved) : [ {name: 'Learnasdfsdfsdf AngularJS', done: true}, {name: 'Build ansadfsdfsdf Angular app', done: true} ];
        localStorage.setItem('localT', JSON.stringify(toddos));
        return toddos
      }
    };     
  })

  app.controller('TodoController', ['$scope','Todos', function ($scope, Todos) {

    $scope.todos = Todos.getData();

    $scope.$watch('todos', function(newVal){
      var str = angular.toJson(newVal); 
      window.localStorage['localT'] = str; 
    }, true);

    $scope.update = function() {
      $scope.todos.push({
        name: $scope.todoText,
        done: false
      });
      $scope.todoText = '';
      localStorage.setItem('localT', JSON.stringify($scope.todos));
    }

    $scope.remove = function(index) { 
      $scope.todos.splice(index, 1);    
      localStorage.setItem('localT', JSON.stringify($scope.todos)); 
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

    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo){
        if (!todo.done)
          $scope.todos.push(todo);
      });
    };

  }])
  
  app.controller('TodoDetailCtrl', ['$scope','$routeParams','Todos', function ($scope, $routeParams, Todos) {
    
    $scope.allTodos = Todos.getData();
    $scope.todo = Todos.getData()[$routeParams.id];

    $scope.change = function() {
      angular.forEach($scope.allTodos, function(eachTodo){
        if (eachTodo.name == $scope.todo.name) {
          eachTodo.done = $scope.todo.done;
          localStorage.setItem('localT', JSON.stringify($scope.allTodos)); 
        }
      })
    }

  }])
  
  app.config(['$routeProvider', function ($routeProvider) {
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