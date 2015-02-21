convergeApp.controller('ConversationCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http,$location, $routeParams){

    $scope.searched = false;

    $scope.count = 0;

    console.log($location.path().split('/'));
    var user = $location.path().split('/');

    // io.socket.on('join',function(sendData){
    //     console.log('received socket event. Yelp', sendData);
    //     $scope.searched = true;
    //     $scope.places = [];
    //     $scope.$apply(function(){
    //         $scope.places = sendData.yelp.businesses;
    //         $scope.count = $scope.places.length;
    //     })
    // });

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

    if(user[1] === 'conversation'){
        io.socket.on('join', function(sendData){
            console.log('received socket event. Yelp', sendData);
            $scope.searched = true;
            $scope.places = [];
            $scope.$apply(function(){
                $scope.places = sendData.yelp.businesses;
                $scope.count = $scope.places.length;
            })
        })
    } else {
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

                io.socket.post('/api/conversation/' + joinId + '/join', userPosition, function(sendData){
                    // console.log('data',data);
                    var convoId = sendData.convo[0].id
                    $scope.places = [];
                    $scope.$apply(function(){
                        $scope.searched = true;
                        $scope.places = sendData.yelp.businesses;
                        $scope.count = $scope.places.length;
                        $location.path('/join/' + convoId);
                    });

                    // io.socket.on('join',function(sendData){
                    //     console.log('received socket event. Yelp', sendData);
                    //     var convoId = sendData.convo[0].id
                    //     $scope.searched = true;
                    //     $scope.places = [];
                    //     $scope.$apply(function(){
                    //         $scope.places = sendData.yelp.businesses;
                    //         $scope.count = $scope.places.length;
                    //         $location.path('/join/' + convoId);
                    //     })
                    // });
                });
            })
        } else {
            console.log('Could not get position');
        }
    }

    // $scope.joinConvo = function(){

    //     if(navigator.geolocation){
    //         navigator.geolocation.getCurrentPosition(function(position){
    //             // console.log(position)

    //             var userPosition = {
    //                 latB: position.coords.latitude,
    //                 lonB: position.coords.longitude
    //             };
    //             console.log(userPosition);

    //             var joinId = $routeParams.id;
    //             console.log(joinId);

    //             io.socket.post('/api/conversation/' + joinId + '/join', userPosition, function(sendData){
    //                 // console.log('data',data);
    //                 var convoId = sendData.convo[0].id
    //                 $scope.places = [];
    //                 $scope.$apply(function(){
    //                     $scope.searched = true;
    //                     $scope.places = sendData.yelp.businesses;
    //                     $scope.count = $scope.places.length;
    //                     $location.path('/join/' + convoId);
    //                 });

    //                 // io.socket.on('join',function(sendData){
    //                 //     console.log('received socket event. Yelp', sendData);
    //                 //     var convoId = sendData.convo[0].id
    //                 //     $scope.searched = true;
    //                 //     $scope.places = [];
    //                 //     $scope.$apply(function(){
    //                 //         $scope.places = sendData.yelp.businesses;
    //                 //         $scope.count = $scope.places.length;
    //                 //         $location.path('/join/' + convoId);
    //                 //     })
    //                 // });
    //             });
    //         })
    //     } else {
    //         console.log('Could not get position');
    //     }
    // };

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
    // $scope.nextPlace = function() {
    //     if($scope.count === 1){
    //         alert('You are too picky. Goodbye.');
    //         $scope.places.shift()
    //         $scope.count = $scope.places.length;
    //     } else {
    //         $scope.places.shift()
    //         $scope.count = $scope.places.length;
    //     }
    // }
    $scope.nextPlace = function(){
        var id = $routeParams.id;

        var info = {
            place: $scope.places[0],
            answer:'no',
            whatUser: user[1]
        }
        io.socket.post('/api/conversation/' + id + '/answer', info, function(data){
            //check data
        })
    }

    $scope.yes = function(){
        var id = $routeParams.id;

        var info = {
            place: $scope.places[0],
            answer: 'yes',
            whatUser: user[1]
        }
        io.socket.post('/api/conversation/' + id + '/answer', info, function(data){
            //do some shit
        })
    }

    io.socket.on('answer', function(data){
        if(data.answer === 'no'){
            if($scope.count === 1){
                alert('You are too picky. Goodbye.');
                $scope.places.shift()
                $scope.count = $scope.places.length;
            } else {
                if(data.place.name === $scope.places[0].name){
                    $scope.$evalAsync(function(){
                        $scope.places.shift()
                        $scope.count = $scope.places.length;
                        $scope.answer = data.answer;
                        $scope.whatUser = data.whatUser;
                    });
                }

            }
        }else{
            $scope.$evalAsync(function(){
                $scope.answer = data.answer;
                $scope.whatUser = data.whatUser;
            });
        }

    });


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