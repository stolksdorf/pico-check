//const Emitter = require('events');
const chalk = require('chalk');

let depth = 0;

// https://github.com/avajs/ava/blob/master/lib/beautify-stack.js

// https://github.com/avajs/ava/blob/master/lib/code-excerpt.js


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
stdoutHook(()=>logUsed = true);


const Verbose = (type, item)=>{
	const match = {
		start : ()=>{},

		start_group : (group)=>{
			if(!group.name) return;
			console.log('\n' + pad(chalk.cyan('◆ ' +  group.name)));
			depth += 2;
		},

		end_group : (group)=>{
			if(!group.name) return;
			console.log('\n');
			depth -= 2;
		},


		//TODO: might not need this
		start_test : (test)=>{
			console.log(pad(chalk.yellow(`● ${test.name}...`)));
			console.log(pad(chalk.magenta('▼──Test Logs───────────\n')));
			logUsed = false;
		},

		end_test : (test)=>{

			if(!logUsed){
				clearLines(3);
			}else{
				console.log(pad(chalk.magenta('\n▲──Test Logs────────────')));
			}


			if(!test.error){
				return console.log(pad(chalk.green(`✓ ${test.name}`)));
			}
			console.log(pad(chalk.bgRed(`X ${test.name}`)));

		},

		end : (results)=>{
			console.dir(results, {depth:null})
			console.log('──────────');
			console.log('Done!');

		}
	};

	if(match[type]) match[type](item)
};


module.exports = Verbose;