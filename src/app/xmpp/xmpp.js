var XmppClient = require('node-xmpp-client');
var ltx = require('ltx');

angular.module( 'nodeTalker.xmpp', [
  'ui.router'
])

.service('xmppService', function($rootScope) {
  var NS_CHATSTATES = "http://jabber.org/protocol/chatstates";
  var STATUS = {
      AWAY: "away",
      DND: "dnd",
      XA: "xa",
      ONLINE: "online",
      OFFLINE: "offline"
  };
  var client = {};
  return {
    authenticating: false,
    client: client,
    connect: function(username, password) {
      var that = this;
      that.authenticating = true;

      that.client = new XmppClient({
        jid: username + '@gmail.com',
        password: password,
        host: 'talk.google.com',
        port: 5222
      });

      that.client.addListener('online', function(data) {
        that.authenticating = false;
        console.log('Connected as ' + data.jid.user + '@' + data.jid.domain + '/' + data.jid.resource);
        $rootScope.$broadcast("xmpp:online", data.jid.user, data.jid.domain, data.jid.resource);
        that.client.send(new ltx.Element('presence'));
      });

      that.client.addListener('error', function(e) {
        that.authenticating = false;
        console.log(e);
        if(e === "XMPP auhtentication failure") {
          $rootScope.$broadcast("xmpp:authFailure");
        } else {
          $rootScope.$broadcast("xmpp:error", e);
        }
      });

      $rootScope.$on('$idleTimeout', function() {
        that.client.send(new ltx.Element('presence').c('show').t('away'));
      });

      $rootScope.$on('$idleEnd', function() {
        that.client.send(new ltx.Element('presence'));
      });

      that.client.on('stanza', function(stanza) {
        console.log(stanza);
        var body = null,
            from = null,
            message = null;
        if(stanza.is('message')) {
          //console.dir(stanza);
          if(stanza.attrs.type === 'chat') {
            body = stanza.getChild('body');
            if(body) {
              message = body.getText();
              from = stanza.attrs.from;
              console.log('Message from %s - %s', from, message);
              $rootScope.$broadcast('xmpp:chat', from, message);
            }

            var chatstate = stanza.getChildByAttr('xmlns', NS_CHATSTATES);
            if(chatstate) {
              console.log('Chatstate from %s - %s', stanza.attrs.from, chatstate.name);
              $rootScope.$broadcast('xmpp:chatstate', stanza.attrs.from, chatstate.name);
            }

            var typingxmlns = stanza.getChildByAttr('xmlns:cha', NS_CHATSTATES);
            if(typingxmlns) {
              var typingstate = typingxmlns.name.split(":").slice(-1)[0];
              if(typingstate) {
                console.log('Typingstate from %s - %s', stanza.attrs.from, typingstate);
                $rootScope.$broadcast('xmpp:typingstate', stanza.attrs.from, typingstate);
              }
            }
          } else if(stanza.attrs.type === 'groupchat') {
            body = stanza.getChild('body');
            if(body) {
              message = body.getText();
              from = stanza.attrs.from;
              var conference = from.split('/')[0];
              var stamp = null;
              if(stanza.getChild('x') && stanza.getChild('x').attrs.stamp) {
                stamp = stanza.getChild('x').attrs.stamp;
              }
              console.log('Groupchat conference:%s from:%s stamp:%s - %s', conference,from,message,stamp);
              $rootScope.$broadcast('xmpp:groupchat', conference,from,message,stamp);
            }
          }
        } else if(stanza.is('presence')) {
          from = stanza.attrs.from;
          if(from) {
            if(stanza.attrs.type === 'subscribe') {
              console.log('Subscribe from %s', from);
              $rootScope.$broadcast('xmpp:subscribe', from);
            } else if(stanza.attrs.type === 'unsubscribe') {
              console.log('Unsubscribe from %s', from);
              $rootScope.$broadcast('xmpp:unsubscribe', from);
            } else {
              var statusText = stanza.getChildText('status');
              var state = (stanza.getChild('show')) ? stanza.getChild('show').getText() : STATUS.ONLINE;
              var priority = (stanza.getChild('priority')) ? stanza.getChild('priority').getText() : null;
              state = ( state === 'chat' ) ? STATUS.ONLINE : state;
              state = ( stanza.attrs.type === 'unavailable' ) ? STATUS.OFFLINE : state;
              console.log('Availability from %s - %s | %s || p%s', from, state, statusText, priority );
              $rootScope.$broadcast('xmpp:availability', from, state, statusText, priority);
            }
          }
        }
      });
    }
  };
})
;
