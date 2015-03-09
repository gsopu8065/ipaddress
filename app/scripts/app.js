;(function (window, angular, _, undefined) { 'use strict';


//main module
  angular.module('ipAddress',[
	  'ngCookies'
    , 'ngSanitize'
    , 'ngRoute'
    , 'ui.bootstrap'
    , 'map.route'
    , 'map.ipaddress'
	])
	
	.controller('IPAddressAppCtrl', function ($scope, $location,ROUTE){
		console.log('controller');
		 
	});

})(window, window.angular, window._);
