/**
 * Created by mosesesan on 24/09/15.
 */

MovieDBAPI = function ($http, $q, $localStorage, API_KEY) {

    this.upcoming_movies;
    deferred = $q.defer();// deferred contains the promise to be returned
    var self = this;
    this.getData = function(){
        //Get data from server
        $http.get('http://api.themoviedb.org/3/movie/upcoming?api_key='+API_KEY)

            .then(function(response) {
                if (typeof response.data === 'object') {
                    deferred.resolve(response);// to resolve (fulfill) a promise use .resolve
                    //var totalPages = response.data.total_pages;
                    self.upcoming_movies = response.data.results;
                    console.log(self.upcoming_movies[0])
                    $localStorage.last_updated = new Date();
                } else {
                    // invalid response
                    deferred.reject(response.data);
                }

            }, function(response) {
                // something went wrong
                deferred.reject(response);// to reject a promise use .reject
            });

        // promise is returned
        return deferred.promise;
    };

    this.getTimeDiff = function(last_updated){
        //check hour diff
        var hourDiff = new Date().getHours() - new Date(last_updated).getHours();
        return hourDiff;
    };

    //Initialise, call the api to get the data
    this.checkForUpdates = function(){
        var cachedData = $localStorage.cached_data; //get local cached storage data
        if (cachedData === null || cachedData === undefined){
            self.getData();
        }else{
            self.upcoming_movies = cachedData;
            var last_updated = $localStorage.last_updated; //check last updated date
            if (last_updated === null || last_updated === undefined || this.getTimeDiff(last_updated) >= 1) this.getData();
        }
    };

    //Call the initialize function to retrieve the data
    this.checkForUpdates();

}



var DataService = angular.module('DataService', ['myApp.config', 'ngStorage']);
DataService.service('dataService', ['$http', '$q', '$localStorage', 'API_KEY', MovieDBAPI]);