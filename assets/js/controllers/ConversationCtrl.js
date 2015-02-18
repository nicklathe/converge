convergeApp.controller('ConversationCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

    $scope.searched = false;

    $scope.startYelp = function(){
        $scope.searched = true;
        $scope.places = [];
        $http.get('/yelp').success(function(data){
            $scope.places = data.businesses;
        }).error(function(err){
            alert(err);
        })
    }
    $scope.nextPlace = function() {
        $scope.places.shift()
    }
    //GeoLocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position)
            // alert(position.coords.latitude + ", " + position.coords.longitude);
            var myId = $routeParams.id
            var myPosition = {
                lat: position.coords.latitude,
                lon: position.coords.latitude,
                convoId: $routeParams.id
            };

            $http.put('/api/conversation/' + myId, myPosition)
            .success(function(data){
                // alert('It worked: ', data);
            }).error(function(err){
                // alert(err);
            })
        })
    } else {
        console.log('Could not get position');
    }

}]);