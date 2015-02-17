convergeApp.controller('MainNavCtrl', ['$scope', '$location', function($scope, $location){

    $scope.navCollapsed = true;

    $scope.isActive = function(url){
        return url === $location.path();
    };

}])