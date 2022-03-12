#!/usr/bin/env node

const fs = require('fs');
const check = require('./')

let watch = false;
let target = process.argv.reduce((acc, arg)=>{
	if(arg == '-w' || arg == '--watch' || arg == '--dev'){
		watch = true;
	}else{
		acc = arg;
	};
	return acc;
});

if(target[0] !== '.') target = './' + target;
target = require.resolve(target, { paths : [process.cwd()]});

if(!watch) return check(require(target)).then((results)=>{ process.exit(results.failed === 0 ? 0 : 1); });

let cases = require(target);
const srcs = Object.keys(require.cache).filter(src=>src.indexOf('node_modules')==-1);

let timer;
const run = ()=>{
	console.clear();
	console.log(`-- Watch Mode ${target} --\n\n`);
	check(require(target));
};

srcs.map(src=>{
	fs.watch(src, ()=>{
		delete require.cache[src];
		delete require.cache[target];
		clearInterval(timer);
		timer = setTimeout(run, 10);
	})
});
run();