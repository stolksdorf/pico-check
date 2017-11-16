const chalk = require('chalk');

const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

let groups = [];
let passed = 0;
let failed = 0;

const update = (test)=>{
	clearLines(4);
	test.passing ? passed++ : failed++;
	console.log(`${groups[groups.length -1 ]} >> ${test.name}`);
	console.log();
	console.log(`${passed} passed`);
	console.log(`${failed} failed`);
};


const Mini = (type, item)=>{
	const match = {
		start : ()=>{
			console.log('\n\n\n');
		},

		start_group : (group)=>groups.push(group.name),
		end_group   : (group)=>groups.pop(),


		start_test : (test)=>update(test),
		end_test : (test)=>update(test),

		end : (results)=>{
			//console.dir(results, {depth:null},
			console.log('──────────');
			console.log('Done!');

		}


	}
	if(match[type]) match[type](item);
};

module.exports = Mini;