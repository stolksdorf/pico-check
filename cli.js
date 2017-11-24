#!/usr/bin/env node

const minimist = require('minimist');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const Test = require('./pico-test.js');

console.log(Object.keys(Test));

const getPckg = (currPath = path.resolve(''))=>{
	const pckg = path.join(currPath, 'package.json');
	if(fs.existsSync(pckg)) return require(pckg);
	const info = path.parse(currPath);
	if(info.root == info.dir) return {};
	return getConfig(info.dir);
};
const defaults = {
	tests   : ['*.test.js'],
	tap     : false,
	verbose : false,
	require : false,
	watch   : false,
	timeout : 500
};
const parseArgs = ()=>{
	const opts = {
		boolean : ['tap', 'verbose'],
		string  : ['timeout', 'require'],
		alias   : { require : 'r', verbose : 'v', tap : 't', watch : 'w' }
	};
	let args = minimist(process.argv.slice(2), opts);
	if(args._.length) args.tests = args._;
	delete args._;
	opts.boolean.map((key)=>{ if(!args[key]) delete args[key]; });
	return args;
};
const opts = Object.assign({}, defaults, getPckg().picotest, parseArgs())
if(opts.watch === true) opts.watch = '*.js';
if(typeof opts.watch == 'string') opts.watch = [opts.watch];


/* --------------------- */

//console.log(opts);

const runningGroup = Test.createGroup();




const TestGroups = [].concat(...opts.tests.map((testPath)=>glob.sync(testPath)))
			.map((testPath)=>require(path.resolve(testPath)))

TestGroups.map((testGroup)=>runningGroup.add(testGroup));

console.log(runningGroup);


//const TestGroups = glob.sync(opts.tests.join(' ')).map((testPath)=>require(path.resolve(testPath)));



let reporter = require('./reporters/mini.js');
if(opts.verbose) reporter = require('./reporters/verbose.js');
if(opts.tap) reporter = require('./reporters/tap.js');


//reporter('start', runningGroup);

runningGroup
	.run({
		reporter
	}, true) //TODO: add in opts
	//TODO: Add a second parameter to run to show that it's a top level run
		//
//	.then(()=>reporter('end', runningGroup))
	.then(()=>{
		runningGroup.passing ? process.exit(1) : process.exit(0);
	})


// //TODO: make into an async map
// const result = Promise.resolve();
// TestGroups.map((tc)=>{
// 	console.log(tc);
// 	result.then(()=>tc.run(reporter))
// });
// result
// 	.then(()=>reporter('end'))
// 	.then(()=>{
// 		//check for any failed, if so emit process.exit(0)
// 		process.exit(1);
// 	})



//Load reporter
//call 'start'
// map the run function with reporter as opt(?)


// console.log(TestCases);

