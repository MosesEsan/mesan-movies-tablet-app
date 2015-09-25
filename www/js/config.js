/**
 * Created by mosesesan on 24/09/15.
 */
var config_module = angular.module('myApp.config', [])
        .constant('APP_NAME','MEP')
        .constant('APP_VERSION','0.1')
        .constant('API_KEY','a3e3a1d79235a1ef189dbb0c243f240e')
        .constant('API_URL','http://api.themoviedb.org/3/movie/')
        .constant('IMG_URL','http://image.tmdb.org/t/p/w500')
    ;