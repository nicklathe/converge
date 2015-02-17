convergeApp.controller('HomeCtrl', ['$scope', '$document', function($scope, $document){

    var section2 = angular.element(document.getElementById('section-2'));

    $scope.toSection2 = function() {
          container.scrollTo(section2, 0, 1000);
        }

}]);