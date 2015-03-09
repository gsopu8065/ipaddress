;(function (window, angular, undefined) {'use strict';

	var ROUTE = {
		 HOME: '/',
	};

	angular.module('map.route', [
    'ngRoute'])
    .constant('ROUTE', ROUTE)
	.config(function ($routeProvider){

	  var routes = {
          home: {
            templateUrl: 'scripts/map.ipaddress/ipaddress.html',
            controller: 'IPAddressAppCtrl',        
         }
       };
       

        $routeProvider
           /** home page **/
        .when(ROUTE.HOME, routes.home);


	});

})(window, window.angular);

