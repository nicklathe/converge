convergeApp.controller('ConversationCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http,$location, $routeParams){

    $scope.searched = false;

    $scope.count = 0;

    console.log($location.path().split('/'));

    io.socket.on('join',function(data){
        console.log('received socket event. Yelp', data);
        $scope.$apply(function(){
            $scope.places = data.businesses;
            $scope.count = $scope.places.length;
        })
    });

    /*
    if(conversation){
        io.socket.on('join',function(data){
            //other user joined
            //populate yelp array
        });
    }else{  // it's join
        //geolocate and then...
        io.socket.post('/api/conversation/join...',{})
    }

    //might receive own messages
    io.socket.on('answer',function(data){
        //if data.user!== myUser  (A or B)
        //other user said yes / no to something

        //$scope.$apply(function(){
            $scope.something="";
        })
    });
    */

    $scope.joinConvo = function(){

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                // console.log(position)

                var userPosition = {
                    latB: position.coords.latitude,
                    lonB: position.coords.longitude
                };
                console.log(userPosition);

                var joinId = $routeParams.id;
                console.log(joinId);

                io.socket.post('/api/conversation/' + joinId + '/join', userPosition, function(data){
                    // console.log('data',data);
                    var convoId = data.id
                    $scope.$apply(function(){
                        $location.path('/join/' + convoId);
                    });
                });
            })
        } else {
            console.log('Could not get position');
        }
    };

    // $scope.startYelp = function(){
    //     $scope.searched = true;
    //     $scope.places = [];
    //     $http.get('/yelp').success(function(data){
    //         $scope.places = data.businesses;
    //         $scope.count = $scope.places.length;
    //     }).error(function(err){
    //         alert(err);
    //     })
    // }
    $scope.nextPlace = function() {
        if($scope.count === 1){
            alert('You are too picky. Goodbye.');
            $scope.places.shift()
            $scope.count = $scope.places.length;
        } else {
            $scope.places.shift()
            $scope.count = $scope.places.length;
        }
    }
    //GeoLocation
    // if(navigator.geolocation){
    //     navigator.geolocation.getCurrentPosition(function(position){
    //         console.log(position)
    //         // alert(position.coords.latitude + ", " + position.coords.longitude);
    //         var myId = $routeParams.id
    //         var myPosition = {
    //             lat: position.coords.latitude,
    //             lon: position.coords.latitude,
    //             convoId: $routeParams.id
    //         };

    //         $http.put('/api/conversation/' + myId, myPosition)
    //         .success(function(data){
    //             // alert('It worked: ', data);
    //         }).error(function(err){
    //             // alert(err);
    //         })
    //     })
    // } else {
    //     console.log('Could not get position');
    // }

}]);