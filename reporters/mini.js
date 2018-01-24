const utils = require('../src/utils.js');
const chalk = require('chalk');
const ErrorReporter = require('../src/error.js');

//https://github.com/helloIAmPau/node-spinner/blob/master/spinners.json

const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

const spinner = "⠙⠹⠸⠼⠴⠦⠧⠇⠏"
let groups, timer, idx=0, status = {passed:0, failed:0, skipped:0};

const update = (test)=>{
	clearLines(5);
	console.log(`${spinner[idx]} ${groups[groups.length-1]} >> ${test.name}`);
	console.log();
	utils.printSummary(status);
};


const Mini = {
	start : ()=>{
		console.log('\n\n\n');
		groups = [];
		status = {
			passed : 0,
			failed : 0,
			skipped : 0,
		};
		timer = setInterval(()=>{
			idx = idx++ % spinner.length;
			update();
		}, 80)
	},
	startGroup : (group)=>groups.push(group.name),
	endGroup   : (group, result)=>groups.pop(),
	startTest  : (test)=>update(test),
	endTest    : (test, result)=>{
		if(result === true) status.passed++;
		if(result === false) status.skipped++;
		if(result instanceof Error) status.failed++;
		update(test);
	},
	end : (summary)=>{
		clearInterval(timer)
		//console.log(summary);
		//console.dir(results, {depth:null})
		console.log('──────────');
		//console.log(summary.errors);
		//errors.map(ErrorReport);

		summary.errors.map((err)=>console.log(ErrorReporter(err)));
	}
};

module.exports = Mini;