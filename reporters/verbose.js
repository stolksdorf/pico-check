//const Emitter = require('events');
const chalk = require('chalk');

const ErrorReport = require('./error.js');

let depth = 0;



/* Utils */
const pad = (str, num)=>' '.repeat(num || depth) + str;
const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

const stdoutHook = (fn=()=>{})=>{
	const old_write = process.stdout.write;
	process.stdout.write = (...args)=>{
		fn(...args);
		old_write.call(process.stdout, ...args);
	};
};

let logUsed = false;
stdoutHook(()=>{
	//if(!logUsed) console.log(chalk.magenta('▼──Test Logs───────────\n'));
	logUsed = true;
});

//TODO: replace with utils.getSummary
let results = {};


//TODO: just return an object with the right function names


const Verbose = {
	start : ()=>{
		//logUsed = false;
		results = {
			passed  : 0,
			failed  : [],
			skipped : 0,
			todo    : 0
		};


	},

	startGroup : (group)=>{
		if(!group.name) return;
		console.log(`\n${pad(chalk.grey(`>> ${group.name}`))}`);
		depth += 2;
	},

	endGroup : (group, results)=>{
		if(!group.name) return;
		//console.log('\n');
		depth -= 2;
	},


	//TODO: might not need this
	startTest : (test)=>{
		console.log(chalk.yellow(`● ${test.name}...`));
		logUsed = false;
	},

	endTest : (test, result)=>{


		//clearLines(1);

		if(!logUsed){
			clearLines(3);
		} else {
			console.log(chalk.magenta('\n▲──Test Logs────────────'));
		}

		if(result instanceof Error){
			return console.log(ErrorReport(result, test.name));
		} else if(result === true){
			return console.log(chalk.green(`✓ ${test.name}`));
		} else if(result === false){
			console.log('skipped');
		}
		//console.log(chalk.bgRed(`X ${test.name}`));
		//console.log(chalk.red(`X ${test.name}`));

	},

	end : (group, results)=>{
		//console.dir(results, {depth:null})
		console.log('──────────');
		console.log('Done!');

	}
};


module.exports = Verbose;