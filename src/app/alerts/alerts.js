angular.module( 'winAlert.alerts', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'alerts', {
    url: '/alerts',
    views: {
      "main": {
        controller: 'AlertsController',
        templateUrl: 'alerts/alerts.tpl.html'
      }
    },
    data:{ pageTitle: 'Alerts' }
  });
})

.controller( 'AlertsController', function AlertsController( $scope, $http ) {
})

;
