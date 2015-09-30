/**
 * Created by mosesesan on 19/09/15.
 */

angular.module('movies', ['MoviesDataService'])
    .config(function($stateProvider) {

        $stateProvider
            // Main Page
            .state('movies', {
                url: '/movies',
                views: {
                    'main': {
                        controller: 'MoviesController',
                        templateUrl: 'views/movies.html'
                    }
                }
            })
    })

    .controller("MoviesController", function ($scope, $rootScope, moviesDataService, IMG_URL, $state) {
        $scope.dataService = moviesDataService;
        $scope.IMG_URL = IMG_URL;
        $scope.selectedMovie = 0;
        $scope.all_actors = "";

        $scope.getMovieInfo = function(movieID, index){
            console.log(movieID)
            dataService.getMovieInfo(movieID, index);
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


