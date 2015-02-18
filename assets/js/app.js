var convergeApp = angular.module('ConvergeApp', ['ngRoute', 'ui.bootstrap', 'duScroll']);

convergeApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {


    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/about', {
            templateUrl: '/views/about.html',
            controller: 'StaticCtrl'
        })
        .when('/conversation/:id', {
            templateUrl: '/views/conversation.html',
            controller: 'ConversationCtrl'
        })

}]);