angular.module('winAlert', [
  'templates-app',
  'templates-common',
  'ui.router'
])

.config( function winAlertConfig ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/stocks');
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

.controller( 'NavController', function NavController( thinker, $scope, $location) {
  $scope.thinker = thinker;
  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
})

;

//bootstrap it
angular.element(document).ready(function() {
  angular.bootstrap(document, ['winAlert']);
});
