// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'DataService', 'myApp.config', 'angularMoment'])
    .config(function() {

    })
    .run(function($ionicPlatform, $rootScope) {

        //temp
        $rootScope.menuOptions =[
            {name : "Now Playing", endpoint: "now_playing"},
            {name : "Upcoming Movies", endpoint: "upcoming"},
            {name : "Popular Movies", endpoint: "popular"}
        ];

        $rootScope.currentOption = $rootScope.menuOptions[0];

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })


    .controller("movieController", function ($scope, $rootScope, dataService, IMG_URL) {

        $scope.dataService = dataService;
        $scope.IMG_URL = IMG_URL;

        $scope.selectedMovie = 0;
        $scope.all_actors = "";

        $scope.getMovieInfo = function(movieID, index){
            console.log(movieID)
            dataService.getMovieInfo(movieID, index);
        }

        $scope.changeMenuOption = function(menuOption){
            $rootScope.currentOption = menuOption;
            dataService.checkForUpdates(menuOption.endpoint);
        }


        $scope.selectMovie = function(id, index){
            $scope.selectedMovie = id;
            $scope.all_actors = "";

            var trailer_source = "";
            var actors = []

            if (!("cast" in dataService.upcoming_movies[index])){
                dataService.getMovieInfo(id, index).then(function(response) {

                    var trailers = response.data.trailers;
                    if (trailers.youtube.length > 0)
                        trailer_source = "http://www.youtube.com/embed/"+trailers.youtube[0].source+"?autoplay=1"
                    else trailer_source = "img/no_trailer.jpg"

                    var cast = response.data.credits.cast;

                    document.getElementById("trailer_"+id).src = "http://www.youtube.com/embed/"+trailer_source+"?autoplay=1"

                    if (cast.length > 0){
                        for (var i = 0; i < cast.length; i++){
                            actors.push(cast[i].name)
                        }
                        var all_actors = actors.join(', ');
                        if (all_actors.length > 100) all_actors = all_actors.substring(0, 100 - 3) + "...";
                        $scope.all_actors = all_actors;
                    }

                }, function(response) {
                    // something went wrong
                });
            }else{
                var movie = dataService.upcoming_movies[index];

                if (document.getElementById("trailer_"+id).src === ""){
                    document.getElementById("trailer_"+id).src = "http://www.youtube.com/embed/"+movie.trailers[0].source+"?autoplay=1";
                }

                var cast = movie.cast;

                if (cast.length > 0){
                    for (var i = 0; i < cast.length; i++){
                        actors.push(cast[i].name)
                    }
                    var all_actors = actors.join(', ');
                    if (all_actors.length > 100) all_actors = all_actors.substring(0, 100 - 3) + "...";
                    $scope.all_actors = all_actors;
                }
            }
        }


        //for (var  i = 0; i < result.length; i++){
        //    console.log(IMG_URL+result[i].poster_path)
        //}
        //dataService.getData()
        //    .then(
        //    function (result) {
        //        // promise was fullfilled (regardless of outcome)
        //        // checks for information will be peformed here
        //        var data = result.data;
        //
        //        var totalPages = data.total_pages;
        //        var result = data.results;
        //        console.log(data)
        //        console.log(result)
        //
        //
        //    },
        //    function (error) {
        //        // handle errors here
        //        console.log(error.statusText);
        //    }
        //);
    });
