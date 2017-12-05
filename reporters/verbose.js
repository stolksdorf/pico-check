//const Emitter = require('events');
const chalk = require('chalk');

const ErrorReport = require('./error.js');

let depth = 0;



/* Utils */
const stdoutHook = (fn=()=>{})=>{
	const old_write = process.stdout.write;
	process.stdout.write = (...args)=>{
		fn(...args);
		old_write.call(process.stdout, ...args);
	};
}


const pad = (str, num)=>' '.repeat(num || depth) + str;
const clearLines = (numLines = 1)=>{
	process.stdout.moveCursor(0, -numLines);
	process.stdout.clearScreenDown();
};

let logUsed = false;
//stdoutHook(()=>logUsed = true);


let results = {};



const Verbose = (type, item)=>{
	const match = {
		start : ()=>{
			results = {
				passed : 0,
				failed : [],
				skipped : 0,
				todo: 0
			}


		},

		start_group : (group)=>{
			if(!group.name) return;
			console.log('\n' + pad(chalk.grey('>> ' +  group.name)));
			depth += 2;
		},

		end_group : (group)=>{
			if(!group.name) return;
			//console.log('\n');
			depth -= 2;
		},


		//TODO: might not need this
		start_test : (test)=>{
			console.log('HEYEYEY', test);
			console.log(chalk.yellow(`● ${test.name}...`));
			//console.log(chalk.magenta('▼──Test Logs───────────\n'));
			//logUsed = false;
		},

		end_test : (test)=>{
			console.log('HEREER', test);

			//clearLines(1);

			// if(!logUsed){
			// 	clearLines(3);
			// }else{
			// 	console.log(chalk.magenta('\n▲──Test Logs────────────'));
			// }

			if(test.error){
				console.log('HERE', test.error);
				console.log(ErrorReport(test.error, test.name));
			}

			if(!test.error){
				console.log(test);
				return console.log(chalk.green(`✓ ${test.name}`));
			}
			//console.log(chalk.bgRed(`X ${test.name}`));
			//console.log(chalk.red(`X ${test.name}`));

		},

		end : (results)=>{
			//console.dir(results, {depth:null})
			console.log('──────────');
			console.log('Done!');

		}
	};

	if(match[type]) match[type](item)
};


module.exports = Verbose;