/**
 * Created by mosesesan on 27/09/15.
 */

TVDBAPI = function ($http, $q, $localStorage, $rootScope, API_KEY, TV_API_URL) {

    this.tvShows = {};
    var self = this;
    this.categories = [];
    this.menuOptions = [];

    $http.get('data.json').success(function (data){
        self.menuOptions = data["TV"];
        self.categories = data["TV"].clone();
        self.categories.splice(0,1);
        var cachedData = $localStorage.cached_data; //get local cached storage data
        if (cachedData === undefined){
            $localStorage.cached_data = {};
            self.getData();
        }else if(cachedData.tvShows === undefined) {
            self.getData();
        }else{
            self.tvShows = cachedData.tvShows;
            var last_updated = cachedData.last_updated; //check last updated date
            if (last_updated === null || last_updated === undefined || self.getTimeDiff(last_updated) >= 1){
                self.getData();
            }
        }
    });

    this.getData = function(){
        var promises = [];

        for(var i = 1; i < self.menuOptions.length; i++){
            var promise = $http({method: 'GET', url: TV_API_URL+self.menuOptions[i].endpoint+'?api_key='+API_KEY, cache: 'true'});
            promises.push(promise);
        }

        $q.all(promises).then(function(data){
            for (var i = 0; i < data.length; i++){
                if (typeof data[i].data === 'object') {
                    var endpoint = self.menuOptions[i].endpoint;
                    self.tvShows[endpoint] = data[i].data.results;
                }
            }
            //Save to local storage
            self.tvShows["last_updated"] = new Date();
            $localStorage.cached_data.tvShows = self.tvShows;
        });

        return $q.all(promises);
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


var DataService = angular.module('TVDataService', ['myApp.config', 'ngStorage']);
DataService.service('tvDataService', ['$http', '$q', '$localStorage', '$rootScope', 'API_KEY', 'TV_API_URL', TVDBAPI]);

