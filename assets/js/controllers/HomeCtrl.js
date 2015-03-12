convergeApp.controller('HomeCtrl', ['$scope', '$http', '$location','$document', function($scope, $http, $location, $document){

    var sectionAbout = angular.element(document.getElementById('section-about'));
    var sectionStart = angular.element(document.getElementById('section-start'));

    $scope.toSectionAbout = function(){
          container.scrollTo(sectionAbout, 0, 2000);
    };

    $scope.toSectionStart = function(){
        container.scrollTo(sectionStart, 0, 2000);
    };

    $scope.startConvo = function(){
        // io.socket.post('/api/conversation/start'{...data...},function(data){ ... })

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                console.log(position)

                var myPosition = {
                    latA: position.coords.latitude,
                    lonA: position.coords.longitude
                };

                io.socket.post('/api/conversation/start', myPosition, function(data){
                    console.log(data);
                    var convoId = data.id
                    $scope.$apply(function(){
                        $location.path('/conversation/' + convoId);
                    });
                });
            })
        } else {
            console.log('Could not get position');
        }

        // $http.post('/api/conversation',{}).success(function(data){
        //     var convoId = data.id
        //     $location.path('/conversation/' + convoId);
        // }).error(function(err){
        //     alert(err);
        // });
    };


}]);