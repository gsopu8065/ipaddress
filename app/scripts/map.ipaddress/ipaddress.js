;(function (window, angular, _, undefined) { 'use strict';


  /**
   * IPAddress Module
   */
  angular.module('map.ipaddress', [
    'ngRoute',
    'map.route'
    ])

  /*.directive('mapIpAddress',  function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/map.ipaddress/ipaddress.html',
      controller: 'IPAddressCtrl'
    };
  })*/
  .controller('IPAddressCtrl',function ($timeout, $scope, $location, $log){

    console.log("controller executed");

  });

})(window, window.angular, window._);
  