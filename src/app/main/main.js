angular.module( 'nodeTalker.main', [
  'ui.router',
  'ngIdle'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'main', {
    url: '/main',
    views: {
      "main": {
        controller: 'MainController',
        templateUrl: 'main/main.tpl.html'
      }
    },
    data:{
      pageTitle: 'Main',
      loginRequired: true
    },

    onEnter: function() {
      win.setResizable(true);
      var mainWidth = localStorage.mainWidth || 800;
      var mainHeight = localStorage.mainHeight || 600;
      win.resizeTo(mainWidth, mainHeight);
    },
    onExit: function() {
    }

  });
})

.controller( 'MainController', function MainController( $scope, $http, currentUser, buddyList ) {
  $scope.buddyList = buddyList;
  $scope.currentUser = currentUser;
  $scope.hiderText = "\u25B6";
  $scope.sendMessage = function(event) {
    if(event.which === 13) {
      if(currentUser.chattingTo && currentUser.currentInput.length > 0) {
        currentUser.chattingTo.sendMessage(currentUser.currentInput);
        currentUser.chattingTo.chatLog.push({
          direction:'outgoing',
          time:moment().format('h:mm:ssa'),
          body:currentUser.currentInput
        });
        currentUser.currentInput = "";
      }
      event.preventDefault();
    }
  };
  $scope.toggleBuddyList = function() {
    buddyList.shown = !buddyList.shown;
    if(buddyList.shown) {
      $scope.hiderText = "\u25B6";
    } else {
      $scope.hiderText = "\u25C0";
    }
  };
  $scope.$on('$idleTimeout', function() {
    $scope.currentUser.idle = true;
  });
  $scope.wakeUp = function() {
    $scope.currentUser.idle = false;
  };
  $scope.goIdle = function() {
    $scope.currentUser.idle = true;
  };
})

//.directive('chatLog', function(currentUser, buddyList, $timeout) {
  //return {
    //restrict: 'A',
    //link: function(scope, element, attr) {
      ////scope.$watchCollection(currentUser.chatLog, function() {
      //scope.$on("ui:message:added", function(event,buddy) {
        //if(buddy === currentUser.chattingTo) {
          //var raw = element[0];
          //console.log("%s - %s === %s",raw.scrollHeight, raw.scrollTop, element.height() + 1);
          //if(raw.scrollHeight - raw.scrollTop <= element.height() + 21) {
            //raw.scrollTop = raw.scrollHeight;
          //}
        //}
      //});
      ////});
    //}
  //};
//})

;
