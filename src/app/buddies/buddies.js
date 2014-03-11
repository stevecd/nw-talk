angular.module( 'nodeTalker.buddies', [
  'ui.router'
] )

.directive('buddyList', function(buddyList, currentUser) {
  return {
    restrict: "AE",
    replace: true,
    templateUrl: "buddies/buddy_list.tpl.html",
    link: function(scope, element, attrs) {
      scope.buddyList = buddyList;
      scope.chatTo = function(buddy) {
        currentUser.switchChattingTo(buddy);
      };
    }
  };
})

.factory('BuddyFactory', function(xmppService) {
  var Buddy = function(username) {
    this.username = username;
    this.shortname = username.split("@")[0];
    this.chatLog = [];
    this.instances = [];
  };
  Buddy.prototype.refreshStatus = function() {
    var that = this;
    var mainInstance = _.sortBy(that.instances, function(instance) {
      return instance.priority;
    }).slice(-1)[0];
    that.status = mainInstance.status;
    that.statusText = mainInstance.statusText;
  };
  Buddy.prototype.cssClasses = function() {
    var that = this;
    var classes = [];
    classes.push(that.status);
    if(that.chatOpen) {
      classes.push("chat-open");
    }
    return classes.join(" ");
  };
  Buddy.prototype.updateStatus = function(jid, status, statusText, priority) {
    var that = this;
    var instance = _.findWhere(that.instances, {jid: jid});
    if(instance) {
      instance.status = status;
      instance.statusText = statusText;
      instance.priority = priority;
    } else {
      instance = {
        jid: jid,
        status: status,
        statusText: statusText,
        priority: priority
      };
      that.instances.push(instance);
    }
    that.refreshStatus();
  };
  Buddy.prototype.sendMessage = function(message) {
    var that = this;
    var stanza = new ltx.Element(
      'message',
      { to: that.username, type: 'chat'}
    ).c('body').t(message);
    xmppService.client.send(stanza);
  };
  return Buddy;
})

.service('buddyList', function($rootScope, BuddyFactory, currentUser) {
  var Buddy = BuddyFactory;
  var knownBuddies = [];
  var findBuddy = function(from) {
    var rootUsername = from.split("/")[0];
    var buddy = _.findWhere(knownBuddies, {username: rootUsername});
    return buddy;
  };

  $rootScope.$on("xmpp:availability", function(event, from,status,statusText, priority) {
    var rootUsername = from.split("/")[0];
    if(rootUsername === currentUser.username) {
      return;
    }
    var buddy = findBuddy(from);
    $rootScope.$apply(function() {
      if(!buddy) {
        buddy = new Buddy(rootUsername);
        knownBuddies.push(buddy);
        console.log("Buddy Added!", buddy);
      }
      buddy.updateStatus(from, status, statusText, priority);
    });
  });

  $rootScope.$on("xmpp:typingstate", function(event, from, typingstate) {
    var buddy = findBuddy(from);
    var rootUsername = from.split("/")[0];
    $rootScope.$apply(function() {
      if(buddy) {
        buddy.typingState = typingstate;
      }
    });
  });

  $rootScope.$on("xmpp:chat", function(event, from, message) {
    var buddy = findBuddy(from);
    $rootScope.$apply(function() {
      buddy.chatLog.push({direction:'incoming', time:moment().format('h:mm:ssa'),body:message});
    });
  });

  return {
    shown: true,
    buddies: knownBuddies,
    findBuddy: findBuddy
  };
})
;
