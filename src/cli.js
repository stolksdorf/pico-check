#!/usr/bin/env node
const chokidar = require('chokidar');
const glob = require('glob');
const chalk = require('chalk');

const utils = require('./utils.js');
const Test = require('./lib.js');
const opts = require('./getopts.js');

if(opts.require) opts.require.map((modulePath)=>utils.requireRelative(modulePath));

const loadReporter = ()=>{
	if(opts.reporter) return utils.requireRelative(opts.reporter);
	if(opts.verbose)  return require('../reporters/verbose.js');
	if(opts.tap)      return require('../reporters/tap.js');
	return require('../reporters/simple.reporter.js');
	//return require('../reporters/mini.js');
};
opts.reporter = loadReporter();

const runTestSuite = ()=>{
	const testGroups = utils.flatMap(opts.tests, (testGlob)=>glob.sync(testGlob, { ignore: opts.ignore }))
		.reduce((acc, testPath)=>{
			testPath = utils.relativePath(testPath);
			delete require.cache[require.resolve(testPath)];
			const testFile = utils.requireRelative(testPath);
			if(!testFile || !testFile.run) return console.error(`Err: ${testPath} did not export a test group.`);
			return acc.concat(testFile);
		}, []);

	const TestSuite = testGroups.reduce((suite, group)=>suite.add(group), Test.createGroup('Test Suite'));

	opts.reporter.start();
	return TestSuite
		.run(opts)
		.then((results)=>{
			const summary = utils.getSummary(results);
			opts.reporter.end(summary, results);
			if(!opts.watch) summary.passing ? process.exit(0) : process.exit(1);
		})
		.catch((err)=>{
			console.error(err);
			process.exit(1);
		});
};

if(opts.watch){
	const runWatch = (event, path)=>{
		runTestSuite()
			.then(()=>console.log(chalk.magentaBright(`\n🕑 Watching enabled on ${opts.source.toString()}`)));
	};
	chokidar.watch(opts.source, { ignored: opts.ignore, ignoreInitial: true }).on('all', runWatch);
	runWatch();
}else{
	runTestSuite();
}

