'use strict';
const fs = require('fs');

const rgxCayetano = /([^a-z#])(define)([^a-zA-Z])/g;

let pixijs = fs.readFileSync('dist/pixi.min.js', 'utf8');

pixijs = pixijs.replace(rgxCayetano, '$1com.cayetano.$2$3');
fs.writeFileSync('dist/pixi.min.js', pixijs);

pixijs = fs.readFileSync('dist/pixi.js', 'utf8');
pixijs = pixijs.replace(rgxCayetano, '$1com.cayetano.$2$3');
fs.writeFileSync('dist/pixi.js', pixijs);

console.log('Replace done!');
