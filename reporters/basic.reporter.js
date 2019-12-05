const utils = require('../src/utils.js');
const ErrorReporter = require('../src/error.js');

const Basic = {
	start : () => {
		process.stdout.write('\x1Bc');
		utils.printDivider(`Last Ran [${new Date().toLocaleTimeString()}]`);
	},
	startGroup : (group) => {},
	endGroup   : (group, result) => {},
	startTest  : (test) => {},
	endTest    : (test, result) => {
		if(result instanceof Error) console.log(ErrorReporter(result));
	},
	end : (summary) => {
		utils.printDivider();
		utils.printSummary(summary);
		utils.printDivider();
	},
};

module.exports = Basic;
