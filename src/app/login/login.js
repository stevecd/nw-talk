angular.module( 'nodeTalker.login', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginController',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data:{ 
      pageTitle: 'Login'
    },
    onEnter: function() {
    }
  });
})

.controller( 'LoginController', function LoginController( $scope, $state, xmppService ) {
  $scope.formInfo = {
    buttonText: 'Log in'
  };
  $scope.login = function() {
    if(!xmppService.authenticating) {
      $scope.formInfo.buttonText = "Authenticating...";
      xmppService.connect($scope.formInfo.username, $scope.formInfo.password);
    }
  };
  $scope.$on("xmpp:authFailure", function() {
    $scope.formInfo.buttonText = "Log in";
  });
  $scope.$on("xmpp:online", function() {
    $scope.formInfo.buttonText = "Log in";
    $state.go('main');
  });
})

.directive( 'snapHeight', function($window) {
  return {
    restrict: 'A',
    replace: false,
    link: function(scope, element, attr) {
      var resize = function() {
        win.setResizable(true);
        win.resizeTo(300,element.height() + 60);
        setTimeout(function() {
          win.setResizable(scope.$eval(attr.snapHeight));
        },100); //ugly hack
      };
      resize();
    }
  };
})

.factory( 'currentUser', function($rootScope) {
  var currentUser = {};
  currentUser.chatLog = [];
  $rootScope.$on("xmpp:online", function(event,id,domain,resource) {
    currentUser.username = [id,'@',domain,'/',resource].join('');
    currentUser.online = true;
  });
  currentUser.switchChattingTo = function(buddy) {
    var that = this;
    if(that.chattingTo === buddy) {
      that.chattingTo.chatOpen = true;
      return;
    }
    if(that.chattingTo) {
      that.chattingTo.chatOpen = false;
    }
    that.currentInput = "";
    that.chattingTo = buddy;
    buddy.chatOpen = true;
    currentUser.chatLog = buddy.chatLog;
  };
  return currentUser;
})

;
