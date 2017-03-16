// Instantiate the app, the 'myApp' parameter must 
// match what is in ng-app
var myApp = angular.module('myApp', []);

// Create the controller, the 'ToddlerCtrl' parameter 
// must match an ng-controller directive
myApp.controller('AppController', function ($scope, $http) {

  var self = this;

  // Define an array of Toddler objects
  $scope.requestStatus = "in progress";
  $scope.requestUrl = "/api/sample.json";
  $scope.responseCode = "";
  $scope.responseData = "";
  $scope.appType = "";

  self.getData = function () {
      $http({
          method: 'GET',
          url: '/api/sample.json'
      }).then(function (data) {
          $scope.requestStatus = "done";
          $scope.responseCode = data.status;
          $scope.responseData = data.data;
          $scope.appType = data.data.response;
      }, function (data) {
          $scope.requestStatus = "done";
          $scope.responseCode = data.status;
          $scope.responseData = data.data;
          $scope.appType = data.data.response;
      });
  };

  self.getData();
  
});