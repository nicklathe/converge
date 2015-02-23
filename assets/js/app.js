var convergeApp = angular.module('ConvergeApp', ['ngRoute', 'ui.bootstrap', 'duScroll', 'ngAnimate']);

convergeApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {


    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/conversation/:id', {
            templateUrl: '/views/conversation.html',
            controller: 'ConversationCtrl'
        })
        .when('/join/:id/start', {
            templateUrl: '/views/join.html',
            controller: 'ConversationCtrl'
        })
        .when('/join/:id', {
            templateUrl: '/views/conversation.html',
            controller: 'ConversationCtrl'
        })

}]);