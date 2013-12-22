angular.module('winAlert', [
  'templates-app',
  'templates-common',
  'ui.router'
])

.config( function winAlertConfig ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/alerts');
})

.run( function run() {
})

.controller( 'WinAlertCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | winAlert' ;
    }
  });
})

.controller( 'MenuController', function NavController($scope, $location) {
})

;

//bootstrap it
angular.element(document).ready(function() {
  angular.bootstrap(document, ['winAlert']);
});
