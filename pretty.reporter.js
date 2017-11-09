const Emitter = require('events');
const chalk = require('chalk');

const Pretty = new Emitter();

let depth = 0;


const write = (str)=>process.stdout.write(str);
const pad = (str, num)=>' '.repeat(num || depth) + str;
const clearLine = ()=>{
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
}

Pretty.on('start_group', (group)=>{
	console.log();
	console.log(pad(chalk.cyan(group.name)));
	depth += 2;
});

Pretty.on('end_group', (group)=>{
	console.log('\n');
	depth -= 2;
});


//TODO: might not need this
Pretty.on('start_test', (test)=>{
	//write(pad(chalk.yellow(`${test.name}`)));
});

Pretty.on('end_test', (test)=>{
	//clearLine();
	if(!test.error){
		return console.log(pad(chalk.green(`✓ ${test.name}`)));
	}
	console.log(pad(chalk.bgRed(`X ${test.name}`)));

});

Pretty.on('finish', (results)=>{
	console.dir(results, {depth:null});
	console.log('Done!');

})



module.exports = Pretty;