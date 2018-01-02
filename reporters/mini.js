const chalk = require('chalk');
const ErrorReport = require('./error.js');

const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

let groupd, passed, failed, skipped;

const update = (test)=>{
	clearLines(5);
	console.log(`${groups[groups.length-1]} >> ${test.name}`);
	console.log();
	printSummary();
};

const printSummary = ()=>{
	console.log(chalk.greenBright(`${passed} passed`));
	console.log(chalk.redBright(`${failed} failed`));
	console.log(chalk.cyanBright(`${skipped} skipped`));
}


const Mini = {
	start : ()=>{
		console.log('\n\n\n');
		groups = [];
		passed = 0;
		failed = 0;
		skipped = 0;
	},
	startGroup : (group)=>groups.push(group.name),
	endGroup   : (group, result)=>groups.pop(),
	startTest  : (test)=>update(test),
	endTest    : (test, result)=>{
		if(result === true) passed++;
		if(result === false) skipped++;
		if(result instanceof Error) failed++;
		update(test);
	},
	end : (summary)=>{
		clearLines(5);
		printSummary();
		//console.log(summary);
		//console.dir(results, {depth:null})
		console.log('──────────');
		console.log('Done!');
		console.log(summary.errors);
		//errors.map(ErrorReport);
	}
};

module.exports = Mini;