const Emitter = require('events');
const chalk = require('chalk');

const Pretty = new Emitter();

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
}

let logUsed = false;
stdoutHook(()=>logUsed = true);

Pretty.on('start_group', (group)=>{
	console.log('\n' + pad(chalk.cyan('◆ ' +  group.name)));
	depth += 2;
});

Pretty.on('end_group', (group)=>{
	console.log('\n');
	depth -= 2;
});


//TODO: might not need this
Pretty.on('start_test', (test)=>{
	console.log(pad(chalk.yellow(`● ${test.name}...`)));
	console.log(pad(chalk.magenta('▼──Test Logs───────────')));
	logUsed = false;
});

Pretty.on('end_test', (test)=>{

	if(!logUsed){
		clearLines(2);
	}else{
		console.log(pad(chalk.magenta('▲──Test Logs────────────')));
	}
	//logUsed = false;


	if(!test.error){
		return console.log(pad(chalk.green(`✓ ${test.name}`)));
	}
	console.log(pad(chalk.bgRed(`X ${test.name}`)));

});

Pretty.on('finish', (results)=>{
	//console.dir(results, {depth:null});
	console.log('──────────');
	console.log('Done!');

})



module.exports = Pretty;