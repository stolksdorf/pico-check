#!/usr/bin/env node


const parseOpts = require('minimist');
const glob = require('glob');

const path = require('path');
const fs = require('fs');
const getPckg = (currPath = path.resolve(''))=>{
	const pckg = path.join(currPath, 'package.json');
	if(fs.existsSync(pckg)) return require(pckg);
	const info = path.parse(currPath);
	if(info.root == info.dir) return false;
	return getConfig(info.dir);
};



console.log('working', getConfig());


//look up to find package.json

console.log(process.cwd());


/*
_ - tests, defaults to '*.test.js'
-w, --watch - defaults to false, if true make it '*.js'
--require='' - add in a require path
--fail-fast?
--timeout

*/


const opts = parseOpts(process.argv.slice(2), {
		alias: { r: 'require' },
		string: 'require',
		default: { r: [] }
	});

console.log(opts);