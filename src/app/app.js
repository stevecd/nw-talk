var gui = require('nw.gui');
var win = gui.Window.get();
win.hide();

angular.module('nodeTalker', [
  'templates-app',
  'templates-common',
  'ui.router',
  'nodeTalker.main',
  'nodeTalker.login',
  'nodeTalker.xmpp',
  'nodeTalker.buddies',
  'luegg.directives',
  'ngIdle'
])

.config( function nodeTalkerConfig ($stateProvider, $urlRouterProvider, $idleProvider, $keepaliveProvider) {
  $urlRouterProvider.otherwise('/login');
  $idleProvider.idleDuration(60*5);
  $idleProvider.warningDuration(0);
  $keepaliveProvider.interval(5);
})

.run( function run($rootScope, $state, currentUser) {
  $rootScope.$on('$stateChangeStart', function(event,toState,toParams,fromState,fromParams) {
    if(toState.data.loginRequired && !currentUser.online) {
      event.preventDefault();
      $state.go('login');
      return false;
    }
  });
  //$idle.watch();
})

.controller( 'nodeTalkerCtrl', function nodeTalkerCtrl ( $scope, $idle, $state, currentUser ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | nwTalk' ;
    }
    if(fromState.name === "main") {
      $idle.unwatch();
    } else if(toState.name === "main") {
      $idle.watch();
    }
  });
  $scope.maybeIdle = function(event) {
    if(event.which === 27 && $state.current.name === "main") {
      currentUser.idle = true;
    }
  };
})

.controller( 'MenuController', function NavController($scope, $location) {
})
;

//bootstrap it
angular.element(document).ready(function() {
  win.show();
  angular.bootstrap(document, ['nodeTalker']);
});

