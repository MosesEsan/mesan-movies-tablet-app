/**
 * Created by mosesesan on 24/09/15.
 */
var config_module = angular.module('myApp.config', [])
        .constant('APP_NAME','MEP')
        .constant('APP_VERSION','0.1')
        .constant('API_KEY','a3e3a1d79235a1ef189dbb0c243f240e')
        .constant('MOVIES_API_URL','https://api.themoviedb.org/3/movie/')
        .constant('TV_API_URL','https://api.themoviedb.org/3/tv/')
        .constant('IMG_URL','https://image.tmdb.org/t/p/w500')
    ;