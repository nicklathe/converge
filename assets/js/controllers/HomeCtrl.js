convergeApp.controller('HomeCtrl', ['$scope', '$http', '$location','$document', function($scope, $http, $location, $document){

    var sectionAbout = angular.element(document.getElementById('section-about'));
    var sectionStart = angular.element(document.getElementById('section-start'));

    $scope.toSectionAbout = function(){
          container.scrollTo(sectionAbout, 0, 2000);
    };

    $scope.toSectionStart = function(){
        container.scrllTo(sectionStart, 0, 2000);
    };

    $scope.startConvo = function(){
        $http.post('/api/conversation').success(function(data){
            var convoId = data.id
            $location.path('/conversation/' + convoId);
        }).error(function(err){
            alert(err);
        });
    };


}]);