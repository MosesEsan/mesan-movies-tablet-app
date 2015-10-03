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

    .controller("MoviesController", function ($scope, $rootScope, moviesDataService, IMG_URL, $state, $ionicModal, $sce) {
        $scope.dataService = moviesDataService;
        $scope.IMG_URL = IMG_URL;
        $scope.selectedMovie = 0;
        $scope.all_actors = "";
        $scope.trailer_source =  null;

        $scope.getMovieInfo = function(movieID, index){
            console.log(movieID)
            moviesDataService.getMovieInfo(movieID, index);
        }

        $scope.selectMovie = function(endpoint, index) {

            moviesDataService.getMovieInfo(endpoint, index);
            $scope.selectedMovieIndex = index;
            $scope.selectedMovieEndpoint = endpoint;
            $scope.selectedMovie = moviesDataService.movies[endpoint][index];
            console.log($scope.selectedMovie)

            $ionicModal.fromTemplateUrl('views/movie-details.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

            $scope.closeModal = function () {
                $scope.modal.remove();

            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
                $scope.selectedMovieIndex = null;
                $scope.selectedMovieEndpoint = null;
                $scope.selectedMovie = null;
                $scope.source = null;
                $scope.trailer_source = null;
            });
        }

        $scope.watchTrailers = function(index){
            var selectedMovie = $scope.selectedMovie;
            $scope.source = selectedMovie.trailers[index].source;
            $scope.trailer_source = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.source+"?autoplay=1");


            console.log($scope.trailer_source)
        }
    });

