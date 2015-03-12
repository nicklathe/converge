convergeApp.controller('ConversationCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http,$location, $routeParams){

    $scope.searched = false;

    $scope.count = 0;

    $scope.sendId = $routeParams.id;

    $scope.agreed = false;

    $scope.center = {};

    // $scope.yesCount = 0;
    $scope.yesCountConvo = 0;
    $scope.yesCountJoin = 0;

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

            $scope.searched = true;
            $scope.places = [];
            $scope.$apply(function(){
                $scope.places = sendData.yelp.businesses;
                $scope.count = $scope.places.length;

                angular.extend($scope, {
                    center: {
                        lat: $scope.places[0].location.coordinate.latitude,
                        lng: $scope.places[0].location.coordinate.longitude,
                        zoom: 15
                    },
                    markers: {
                        lunchMarker: {
                            lat: $scope.places[0].location.coordinate.latitude,
                            lng: $scope.places[0].location.coordinate.longitude,
                            focus: true,
                            draggable: false
                        }
                    },
                    defaults: {
                        scrollWheelZoom: false
                    }
                });

            })
        })
    } else {

        $scope.$evalAsync(function(){
            $scope.searched = true;
        })

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){

                var userPosition = {
                    latB: position.coords.latitude,
                    lonB: position.coords.longitude
                };

                console.log(userPosition);

                var joinId = $routeParams.id;

                io.socket.post('/api/conversation/' + joinId + '/join', userPosition, function(sendData){
                    // console.log('userB' + sendData);
                    var convoId = sendData.convo[0].id
                    $scope.places = [];
                    $scope.$evalAsync(function(){
                        $scope.searched = true;
                        $scope.places = sendData.yelp.businesses;
                        $scope.count = $scope.places.length;
                        $location.path('/join/' + convoId);

                        angular.extend($scope, {
                            center: {
                                lat: $scope.places[0].location.coordinate.latitude,
                                lng: $scope.places[0].location.coordinate.longitude,
                                zoom: 15
                            },
                            markers: {
                                lunchMarker: {
                                    lat: $scope.places[0].location.coordinate.latitude,
                                    lng: $scope.places[0].location.coordinate.longitude,
                                    focus: true,
                                    draggable: false
                                }
                            },
                            defaults: {
                                scrollWheelZoom: false
                            }
                        });

                    });
                });
            })
        } else {
            // change this to another kind of alert
            console.log('Could not get position');
        }
    }

    $scope.nextPlace = function(){
        var id = $routeParams.id;

        var info = {
            place: $scope.places[0],
            answer:'no',
            whatUser: user[1],
            // yesCount: 0
            yesCountConvo: 0,
            yesCountJoin: 0
        }
        io.socket.post('/api/conversation/' + id + '/answer', info, function(data){

        })
    }

    $scope.thisPlace = function(){
        var id = $routeParams.id;

        if(user[1] === 'conversation'){
            var info = {
                place: $scope.places[0],
                answer: 'yes!',
                whatUser: user[1],
                yesCountConvo: 1,
                yesCountJoin: 0
            }
        } else {
            var info = {
                place: $scope.places[0],
                answer: 'yes!',
                whatUser: user[1],
                yesCountConvo: 0,
                yesCountJoin: 1
            }
        }
        // var info = {
        //     place: $scope.places[0],
        //     answer: 'yes!',
        //     whatUser: user[1],
        //     yesCount: 1
        // }
        io.socket.post('/api/conversation/' + id + '/answer', info, function(data){

        })
    }

    io.socket.on('answer', function(data){
        $scope.userAnswer = false;

        // $scope.yesCount += data.yesCount;
        // ($scope.yesCountConvo += data.yesCountConvo) || ($scope.yesCountJoin += data.yesCountJoin);
        console.log(data);

        // if(data.yesCountConvo !== NaN) {
        //     $scope.yesCountConvo += data.yesCountConvo;
        // } else if(data.yesCountJoin !== NaN) {
        //     $scope.yesCountJoin += data.yesCountJoin;
        // };

        $scope.yesCountConvo += data.yesCountConvo;
        $scope.yesCountJoin += data.yesCountJoin;

        console.log('convo ' + $scope.yesCountConvo + ' | ' + 'join ' + $scope.yesCountJoin);
        // if($scope.yesCount === 2){
        if($scope.yesCountConvo >= 1 && $scope.yesCountJoin >= 1){
            $scope.$evalAsync(function(){
                $scope.agreed = true;
            })
            return;
        };

        if(data.answer === 'no'){
            if($scope.count === 1){
                alert('You are too picky. Goodbye.');
                $scope.places.shift()
                $scope.count = $scope.places.length;
            } else {
                if(data.place.name === $scope.places[0].name){
                    if(data.whatUser !== user[1]){
                        $scope.userAnswer = true;
                    }
                    // $scope.yesCount = 0;
                    $scope.yesCountConvo = 0;
                    $scope.yesCountJoin = 0;
                    $scope.$evalAsync(function(){
                        $scope.places.shift()
                        $scope.count = $scope.places.length;
                        $scope.answer = data.answer;
                        $scope.userAnswer;


                        angular.extend($scope, {
                            center: {
                                lat: $scope.places[0].location.coordinate.latitude,
                                lng: $scope.places[0].location.coordinate.longitude,
                                zoom: 15
                            },
                            markers: {
                                lunchMarker: {
                                    lat: $scope.places[0].location.coordinate.latitude,
                                    lng: $scope.places[0].location.coordinate.longitude,
                                    focus: true,
                                    draggable: false
                                }
                            },
                            defaults: {
                                scrollWheelZoom: false
                            }
                        });

                    });
                }
            }
        }else{
            if(data.whatUser !== user[1]){
                $scope.userAnswer = true;
            }
            $scope.$evalAsync(function(){
                $scope.answer = data.answer;
                $scope.userAnswer;
            });
        }
    });

}]);





