#!/usr/bin/env node
//const chokidar = require('chokidar');
const minimist = require('minimist');
const glob = require('glob');
const path = require('path');
const fs   = require('fs');
const Test = require('./lib.js');


const flatMap = (list, fn)=>[].concat(...list.map(fn));
const requireRelative = (modulePath)=>require(path.resolve(process.cwd(), modulePath));


const getOpts = ()=>{
	const getPckg = (currPath = path.resolve(''))=>{
		const pckg = path.join(currPath, 'package.json');
		if(fs.existsSync(pckg)) return require(pckg);
		const info = path.parse(currPath);
		if(info.root == info.dir) return {};
		return getConfig(info.dir);
	};
	const defaults = {
		tests    : ['*.test.js'],
		ignore   : ['node_modules'],
		reporter : false,
		tap      : false,
		verbose  : false,
		require  : false,
		useWatch : false,
		watch    : ['*.js'],
		timeout  : 500
	};

	const parseArgs = ()=>{
		const opts = {
			boolean : ['tap', 'verbose', 'useWatch'],
			string  : ['timeout', 'require', 'reporter', 'ignore'],
			alias   : { require: 'r', verbose: 'v', tap: 't', useWatch: 'w', ignore: 'i' }
		};
		const args = minimist(process.argv.slice(2), opts);
		if(args._.length) args.tests = args._;
		delete args._;
		opts.boolean.map((key)=>{ if(!args[key]) delete args[key]; });
		return args;
	};
	const pckg = getPckg();
	const opts = Object.assign({},
		defaults,
		pckg.picotest || pckg.picoTest || pckg['pico-test'],
		parseArgs()
	);

	if(opts.watch === true) opts.watch = '*.js';
	if(typeof opts.watch == 'string') opts.watch = [opts.watch];
	if(typeof opts.ignore == 'string') opts.ignore = [opts.ignore];

	return opts;
};

const loadReporter = (opts)=>{
	if(opts.reporter) return requireRelative(opts.reporter);
	if(opts.verbose)  return require('./reporters/verbose.js');
	if(opts.tap)      return require('./reporters/tap.js');

	return require('./reporters/mini.js');
};


const opts = getOpts();


console.log(opts);


if(opts.require) requireRelative(opts.require);




/* --------------------- */

//console.log(opts);



const runningGroup = flatMap(opts.tests, (testGlob)=>glob.sync(testGlob))
	.reduce((group, testPath)=>{
		const testFile = requireRelative(testPath);
		if(!testFile) console.log(`${testPath} did not export a test group.`);
		return group.add(testFile);
	}, Test.createGroup());


console.dir(runningGroup, { depth: null });


//const TestGroups = glob.sync(opts.tests.join(' ')).map((testPath)=>require(path.resolve(testPath)));


const executeTestSuite = (group)=>{
	group
		.run({
			reporter : loadReporter(opts)
		}, true) //TODO: add in opts
		.then((summary)=>{
			console.dir('summary', summary, { depth: null });
			if(!opts.useWatch) summary.passing ? process.exit(1) : process.exit(0);
		})
		.catch((err)=>{
			console.log('CAUGHT HERE');
			console.error(err);
			process.exit(0);
		});
};




//reporter('start', runningGroup);

if(opts.useWatch){
	// chokidar.watch(opts.watch, {ignored: opts.ignored}).on('all', (event, path) => {
	// 	executeTestSuite(runningGroup);
	// 	console.log('Watcher enabled. PURPLE');
	// });
};




executeTestSuite(runningGroup);


