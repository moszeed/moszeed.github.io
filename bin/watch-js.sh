#! bin/bash
[[ -d ./dist/js/ ]] || mkdir ./dist/js/

GLOBALS="-t sheetify -g [ babelify --configFile "./.babelrc" ] -t [ yo-yoify ]"
PLUGINS=""

watchify ./client/app.js --poll 500 ${GLOBALS} \
    -o 'tee ./dist/js/app.js | uglifyjs -cm --verbose > ./dist/js/app.min.js'
