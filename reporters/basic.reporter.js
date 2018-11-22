const utils = require('../src/utils.js');
const ErrorReporter = require('../src/error.js');

const Basic = {
	start : ()=>{
		utils.printDivider();
	},
	startGroup : (group)=>{},
	endGroup   : (group, result)=>{},
	startTest  : (test)=>{},
	endTest    : (test, result)=>{
		if(result instanceof Error) console.log(ErrorReporter(result));
	},
	end : (summary)=>{
		utils.printDivider();
		utils.printSummary(summary);
		utils.printDivider();
	}
};

module.exports = Basic;