/**
 * Created by mosesesan on 24/09/15.
 */

MovieDBAPI = function ($http, $q, $localStorage, $rootScope, API_KEY, MOVIES_API_URL) {

    this.movies = {};
    var self = this;
    this.categories = [];
    this.menuOptions = [];

    console.log()

    $http.get('data.json').success(function (data){
        self.menuOptions = data["Movies"];
        self.categories = data["Movies"].clone();
        self.categories.splice(0,1);
        var cachedData = $localStorage.cached_data; //get local cached storage data
        if (cachedData === undefined){
            $localStorage.cached_data = {};
            self.getData();
        }else if(cachedData.movies === undefined) {
            self.getData();
        }else{
            self.movies = cachedData.movies;
            var last_updated = cachedData.last_updated; //check last updated date
            if (last_updated === null || last_updated === undefined || self.getTimeDiff(last_updated) >= 1){
                self.getData();
            }
        }
    });

    this.getData = function(){
        var promises = [];

        for(var i = 1; i < this.menuOptions.length; i++){
            var promise = $http({method: 'GET', url: MOVIES_API_URL+self.menuOptions[i].endpoint+'?api_key='+API_KEY, cache: 'true'});
            promises.push(promise);
        }

        $q.all(promises).then(function(data){
            console.log(data)
            for (var i = 0; i < data.length; i++){
                if (typeof data[i].data === 'object') {
                    var endpoint = self.menuOptions[i + 1].endpoint;
                    self.movies[endpoint] = data[i].data.results;
                }
            }
            //Save to local storage
            self.movies["last_updated"] = new Date();
            $localStorage.cached_data.movies = self.movies;
        });

        return $q.all(promises);
    };

    this.getMovieInfo = function(endpoint, index){

        var deferred2 = $q.defer();// deferred contains the promise to be returned
        var movieID = self.movies[endpoint][index].id;

        console.log(movieID)
        $http.get(MOVIES_API_URL+movieID+'?api_key='+API_KEY+'&append_to_response=releases,trailers,credits,similar')

            .then(function(response) {
                if (typeof response.data === 'object') {
                    deferred2.resolve(response);// to resolve (fulfill) a promise use .resolve

                    console.log(response.data)
                    var countries = response.data.releases.countries;
                    var trailers = response.data.trailers;
                    self.movies[endpoint][index]["homepage"] = response.data.homepage;
                    self.movies[endpoint][index]["tagline"] = response.data.tagline;
                    self.movies[endpoint][index]["runtime"] = response.data.runtime;
                    self.movies[endpoint][index]["cast"] = response.data.credits.cast;
                    self.movies[endpoint][index]["crew"] = response.data.credits.crew;
                    self.movies[endpoint][index]["similar"] = response.data.similar.results;
                    self.movies[endpoint][index]["trailers"] = trailers.youtube;
                    self.movies[endpoint][index]["country"]  = countries[0].iso_3166_1;
                    self.movies[endpoint][index]["production_companies"] = response.data.production_companies;
                    self.movies[endpoint][index]["rating"] = (countries[0].certification === "") ? "N/A" : (countries[0].certification);

                    //update local data

                    console.log(self.movies[endpoint][index]["similar"])
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
    };

    this.getTimeDiff = function(last_updated){
        //check hour diff
        var hourDiff = new Date().getHours() - new Date(last_updated).getHours();
        return hourDiff;
    };

    Array.prototype.clone = function() {
        return this.slice(0);
    };
}


var DataService = angular.module('MoviesDataService', ['myApp.config', 'ngStorage']);
DataService.service('moviesDataService', ['$http', '$q', '$localStorage', '$rootScope', 'API_KEY', 'MOVIES_API_URL', MovieDBAPI]);

