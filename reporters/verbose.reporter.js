const utils = require('../src/utils.js');
const chalk = require('chalk');
const ErrorReporter = require('../src/error.js');

const groups = [];

const print = (text, color='grey')=>{
	return console.log(utils.indent(chalk[color](text), groups.length * 2));
};


module.exports = {
	start      : ()=>utils.printDivider(),
	startGroup : (group)=>{
		print(group.name);
		groups.push(group.name);
	},
	endGroup  : (group, result)=>groups.pop(),
	startTest : (test)=>{},
	endTest   : (test, result)=>{
		if(result === true) print(`✓ ${test.name}`, 'greenBright');
		if(result === false) print(`• ${test.name}`, 'cyanBright');
		if(result instanceof Error) print(`X ${test.name}`, 'redBright');
	},
	end : (summary, results)=>{
		//utils.printDivider();

		console.log();

		utils.printSummary(summary);

		//TODO: move to utils
		//console.log(chalk.greenBright(`${summary.passed} passed`));
		//console.log(chalk.cyanBright(`${summary.skipped} skipped`));
		//console.log(chalk.redBright(`${summary.failed} failed`));

		console.log();


		utils.printDivider();

		summary.errors.map((err)=>console.log(ErrorReporter(err)));
	}
};