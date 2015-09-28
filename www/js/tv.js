/**
 * Created by mosesesan on 28/09/15.
 */

angular.module('tv', ['TVDataService'])
    .config(function($stateProvider) {

        $stateProvider
            // Main Page
            .state('tv', {
                url: '/tv',
                controller: 'TVController',
                templateUrl: 'views/tv.html'
            })
    })

    .controller("TVController", function ($scope, $rootScope, tvDataService, IMG_URL, $state) {
        $scope.dataService = tvDataService;
        $scope.IMG_URL = IMG_URL;
        $scope.all_actors = "";

        $scope.getMovieInfo = function(tvShowID, index){
            console.log(tvShowID)
            //dataService.getTVShowInfo(tvShowID, index);
        }

        $scope.selectTVShow = function(id, index){
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

                    document.getElementById("trailer_"+id).src = trailer_source;

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
    });


