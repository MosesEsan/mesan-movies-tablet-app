// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'DataService', 'myApp.config', 'angularMoment'])

    .run(function($ionicPlatform) {
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

    .controller("movieController", function ($scope, $q, dataService, IMG_URL) {

        $scope.dataService = dataService;
        $scope.IMG_URL = IMG_URL;

        $scope.getMovieInfo = function(movieID, index){
            console.log(movieID)
            dataService.getMovieInfo(movieID, index);
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
