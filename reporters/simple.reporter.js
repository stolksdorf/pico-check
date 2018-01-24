const utils = require('../src/utils.js');
const chalk = require('chalk');
const ErrorReporter = require('./error.js');

const groups = [];

const print = (text, color='grey')=>{
	return console.log(utils.indent(chalk[color](text), groups.length * 3));
};

const divider = ()=>console.log(chalk.grey('──────────────────────────────\n'));

module.exports = {
	start      : ()=>divider(),
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
		//divider();

		console.log();

		console.log(chalk.greenBright(`${summary.passed} passed`));
		console.log(chalk.cyanBright(`${summary.skipped} skipped`));
		console.log(chalk.redBright(`${summary.failed} failed`));

		console.log();


		divider();

		summary.errors.map((err)=>console.log(ErrorReporter(err)));
	}
};