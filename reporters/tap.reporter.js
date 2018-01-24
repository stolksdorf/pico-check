/* https://testanything.org/ */
let current = 0;
const TAP = {
	start : (testSuite)=>{
		//TODO: Count all the tests
		const count = 4;
		current = 0;
		console.log(`1..${count}`);
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

module.exports = TAP;