/**
 * Created by mosesesan on 24/09/15.
 */

MovieDBAPI = function ($http, $q, $localStorage, $rootScope, API_KEY, API_URL) {

    this.movies = {};
    var deferred = $q.defer();// deferred contains the promise to be returned
    var self = this;


    this.getData = function(){

        var promises = [];
        var menuOptions = $rootScope.menuOptions;
        console.log($rootScope.menuOptions)

        for(var i = 0; i < menuOptions.length; i++){
            var promise = $http({method: 'GET', url: API_URL+menuOptions[i].endpoint+'?api_key='+API_KEY, cache: 'true'});
            promises.push(promise);
        }

        $q.all(promises).then(function(data){
            console.log(data[0], data[1]);
            console.log(data.length);
            for (var i = 0; i < data.length; i++){
                if (typeof data[i].data === 'object') {
                    var endpoint = menuOptions[i].endpoint;
                    self.movies[endpoint] = data[i].data.results;
                }
            }
            //Save to local storage
            self.movies["last_updated"] = new Date();
            $localStorage.movies = self.movies;
        });

        return $q.all(promises);
    };

    this.getMovieInfo = function(movieID, index){

        var deferred2 = $q.defer();// deferred contains the promise to be returned


        if (!("cast" in self.upcoming_movies[index])){
            $http.get(API_URL+movieID+'?api_key='+API_KEY+'&append_to_response=releases,trailers,credits,similar')

                .then(function(response) {
                    if (typeof response.data === 'object') {
                        deferred2.resolve(response);// to resolve (fulfill) a promise use .resolve

                        var countries = response.data.releases.countries;
                        var trailers = response.data.trailers;
                        self.upcoming_movies[index]["homepage"] = response.data.homepage;
                        self.upcoming_movies[index]["tagline"] = response.data.tagline;
                        self.upcoming_movies[index]["runtime"] = response.data.runtime;
                        self.upcoming_movies[index]["cast"] = response.data.credits.cast;
                        self.upcoming_movies[index]["crew"] = response.data.credits.crew;
                        self.upcoming_movies[index]["similar"] = response.data.similar.results;
                        self.upcoming_movies[index]["trailers"] = trailers.youtube;
                        self.upcoming_movies[index]["country"]  = countries[0].iso_3166_1;
                        self.upcoming_movies[index]["production_companies"] = response.data.production_companies;
                        self.upcoming_movies[index]["rating"] = (countries[0].certification === "") ? "N/A" : (countries[0].certification);

                        //update local data
                    } else {
                        // invalid response
                        deferred2.reject(response.data);
                    }

                }, function(response) {
                    // something went wrong
                    deferred2.reject(response);// to reject a promise use .reject
                });

            // promise is returned
            return deferred2.promise;
        }else{
            return self.upcoming_movies[index];
        }
    };

    this.getTimeDiff = function(last_updated){
        //check hour diff
        var hourDiff = new Date().getHours() - new Date(last_updated).getHours();
        return hourDiff;
    };

    //Initialise, call the api to get the data
    this.checkForUpdates = function(){
        var cachedData = $localStorage.cached_data; //get local cached storage data
        if (cachedData === undefined){
            $localStorage.cached_data = {};
            self.getData();
        }else{
            self.movies = cachedData;
            var last_updated = cachedData.last_updated; //check last updated date
            if (last_updated === null || last_updated === undefined || this.getTimeDiff(last_updated) >= 1){
                console.log("refreshinfg data")
                this.getData();
            }
        }
    };

    //Call the initialize function to retrieve the data
    this.checkForUpdates();

}



var DataService = angular.module('DataService', ['myApp.config', 'ngStorage']);
DataService.service('dataService', ['$http', '$q', '$localStorage', '$rootScope', 'API_KEY', 'API_URL', MovieDBAPI]);

