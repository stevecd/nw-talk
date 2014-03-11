# nw-talk

A simple interface for google talk using node-webkit.

## quickstart
1. `git clone https://github.com/stevecd/nw-talk`
2. `cd nw-talk`
3. `npm install`
4. `bower install`
5. `cd node_modules/ltx/node_modules/node-expat/`
6. `nw-gyp rebuild --target=Your node-webkit version` (can be found by starting node-webkit and going to url 'nw:version')
7. `cd ../../../node_modules/node-xmpp-client/node_modules/ltx/node-expat/`
8. nw-gyp rebuild command again
9. `cd ../../../node_modules/node-xmpp-core/node_modules/ltx/node-expat/`
10. nw-gyp rebuild command again
11. `cd ../../../../`
12. start node-webkit, maybe `nw ./`

It's tedious to have to rebuild the same package 3 times, eventually I hope to figure that out.
