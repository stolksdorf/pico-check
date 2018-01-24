const utils = require('../src/utils.js');
const chalk = require('chalk');
const ErrorReporter = require('../src/error.js');

//https://github.com/helloIAmPau/node-spinner/blob/master/spinners.json

const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

const spinner = '⠙⠹⠸⠼⠴⠦⠧⠇⠏';
let groups, currentTestName='', timer, idx=0, status = { passed: 0, failed: 0, skipped: 0 };

const update = ()=>{
	clearLines(6);
	console.log(`${chalk.magentaBright(spinner[idx])} ${groups[groups.length-1]} >> ${currentTestName}`);
	console.log();
	utils.printSummary(status);
	console.log();
};

const Mini = {
	start : ()=>{
		utils.printDivider();
		console.log('\n\n\n\n\n');
		groups = [];
		status = {
			passed  : 0,
			failed  : 0,
			skipped : 0,
		};
		timer = setInterval(()=>{
			idx = ++idx % spinner.length;
			update();
		}, 80);
	},
	startGroup : (group)=>groups.push(group.name),
	endGroup   : (group, result)=>groups.pop(),
	startTest  : (test)=>update(test),
	endTest    : (test, result)=>{
		if(result === true) status.passed++;
		if(result === false) status.skipped++;
		if(result instanceof Error) status.failed++;
		currentTestName = test.name;
		update();
	},
	end : (summary)=>{
		clearInterval(timer);
		clearLines(8);
		summary.errors.map((err)=>console.log(ErrorReporter(err)));
		utils.printDivider();
		utils.printSummary(summary);
		utils.printDivider();
	}
};

module.exports = Mini;