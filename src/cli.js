#!/usr/bin/env node
const chokidar = require('chokidar');
const glob = require('glob');
const chalk = require('chalk');

const utils = require('./utils.js');
const Test = require('./lib.js');
const opts = require('./getopts.js');
const ErrorReporter = require('../src/error.js');

if(opts.require) opts.require.map((modulePath)=>{
	if(modulePath[0] == '.'){
		utils.requireRelative(modulePath);
	}else{
		require(modulePath);
	}
});

const loadReporter = ()=>{
	if(opts.reporter) return utils.requireRelative(opts.reporter);
	if(opts.verbose)  return require('../reporters/verbose.reporter.js');
	if(opts.tap)      return require('../reporters/tap.reporter.js');
	return require('../reporters/mini.reporter.js');
};
opts.reporter = loadReporter();

const runTestSuite = ()=>{
	const testGroups = utils.flatMap(opts.tests, (testGlob)=>glob.sync(testGlob, { ignore: opts.ignore }))
		.reduce((acc, testPath)=>{
			testPath = utils.relativePath(testPath);
			delete require.cache[require.resolve(testPath)];
			const testFile = utils.requireRelative(testPath);
			if(!testFile || !testFile.run) throw `Err: ${testPath} did not export a test group.`;
			return acc.concat(testFile);
		}, []);

	const TestSuite = testGroups.reduce((suite, group)=>suite.add(group), Test.createGroup('tests'));

	opts.reporter.start(TestSuite);
	return TestSuite
		.run(utils.merge(opts))
		.then((results)=>{
			const summary = utils.getSummary(results);
			opts.reporter.end(summary, results);
			if(!opts.watch){
				if(opts.failSkip && summary.skipped !== 0) return process.exit(1);
				if(summary.passing) return process.exit(0);
				return process.exit(1);
			}
		})
		.catch((err)=>{
			console.error(err);
			process.exit(1);
		});
};

if(opts.watch){
	const runWatch = ()=>{
		try {
			runTestSuite()
				.then(()=>console.log(chalk.magentaBright(`🕑 Watching enabled on ${opts.source.toString()}`)));
		} catch (err){
			console.log(ErrorReporter(err));
		}
	};
	chokidar.watch(opts.source, { ignored: opts.ignore, ignoreInitial: true }).on('all', (err, filepath)=>{
		delete require.cache[require.resolve(utils.relativePath(filepath))];
		runWatch();
	});
	runWatch();
} else {
	runTestSuite();
}
