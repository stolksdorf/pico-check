const chalk = require('chalk');
const ErrorReport = require('./error.js');

const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

const groups = [];
const errors = [];
let passed = 0;
let failed = 0;
let skipped = 0;

const update = (test)=>{
	clearLines(5);
	console.log(`${groups[groups.length-1]} >> ${test.name}`);
	console.log();
	console.log(chalk.green(`${passed} passed`));
	console.log(chalk.red(`${failed} failed`));
	console.log(chalk.blue(`${skipped} skipped`));
};


const Mini = {
	start : ()=>{
		console.log('\n\n\n');
	},
	startGroup : (group)=>groups.push(group.name),
	endGroup   : (group, result)=>groups.pop(),
	startTest  : (test)=>update(test),
	endTest    : (test, result)=>{
		if(result === true) passed++;
		if(result === false) skipped++;
		if(result instanceof Error){
			failed++;
			errors.push(result);
		}
		update(test);
	},
	end : (results)=>{
		//console.dir(results, {depth:null},
		console.log('──────────');
		console.log('Done!');
		errors.map(ErrorReport);
	}
};

module.exports = Mini;