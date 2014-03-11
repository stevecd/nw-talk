# nw-talk

A simple interface for google talk using node-webkit.

## quickstart
`git clone https://github.com/stevecd/nw-talk`
`cd nw-talk`
`npm install`
`bower install`
`cd node_modules/ltx/node_modules/node-expat/`
`nw-gyp rebuild --target=Your node-webkit version (can be found by starting node-webkit and going to url 'nw:version')`
`cd ../../../node_modules/node-xmpp-client/node_modules/ltx/node-expat/`
`nw-gyp rebuild command again`
`cd ../../../node_modules/node-xmpp-core/node_modules/ltx/node-expat/`
`nw-gyp rebuild command again`
`cd ../../../../`
`start node-webkit, maybe 'nw ./'`

It's tedious to have to rebuild the same package 3 times, eventually I hope to figure that out.
