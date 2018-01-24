/* https://testanything.org/ */
let current = 0;
module.exports = {
	start : (testSuite)=>{
		const getCount = (group)=>group.tests.reduce((acc, test)=>acc + (test.tests ? getCount(test) : 1), 0);
		current = 0;
		console.log(`1..${getCount(testSuite)}`);
	},
	startGroup : (group)=>{},
	endGroup   : (group, result)=>{},
	startTest  : (test)=>{},
	endTest    : (test, result)=>{
		current++;
		if(result === true) console.log(`ok ${current} - ${test.name}`);
		if(result === false) console.log(`ok ${current} - # SKIP ${test.name}`);
		if(result instanceof Error) console.log(`not ok ${current} - ${test.name}`);
	},
	end : (summary)=>{}
};