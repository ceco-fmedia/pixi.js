'use strict';
const fs = require('fs');
const process = require('child_process');

const toPatch = ['dist/pixi.min.js', 'dist/pixi.js'];
const fileHead = '(function(){var define=com.cayetano.define,require=com.cayetano.require,global={};\n';
const removeGlCore = /[,]?window.PIXI.glCore[\s]?=[\s]?[a-zA-Z]+[;]?/;
const removeGlPIXI = /window\.PIXI[\s=]+?window\.PIXI[\s]?\|\|[\s]?\{\}[;]?/;

function cayComment(content)
{
    const p1 = content.indexOf('/*');
    const p2 = content.indexOf('*/', p1) + 3;
    const version = /pixi.js - v[0-9.]+/;

    let comment = content.substring(p1, p2);
    const found = comment.match(version);
    const build = process.execSync('git rev-parse --short HEAD', {
        encoding: 'utf8',
    }).trim();

    if (found)
    {
        comment = comment.replace(version, `${found} - ${build}`);

        const compiled = comment.indexOf('Compiled');

        if (compiled !== -1)
        {
            comment = comment.substring(0, comment.lastIndexOf('\n', compiled))
                + comment.substring(comment.indexOf('\n', compiled));
        }
    }

    return comment + content.substring(0, p1) + content.substring(p2);
}

for (let x = 0; x < toPatch.length; ++x)
{
    const fName = toPatch[x];
    let content = fs.readFileSync(fName, 'utf8');

    content = content.substring(0, content.lastIndexOf('//# sourceMappingURL'));
    content = `${fileHead + content.trim()}\n})();`;
    content = cayComment(content)
        .replace(removeGlCore, '')
        .replace(removeGlPIXI, '1');

    fs.writeFileSync(fName, content);
}

console.log('Replace done!');
