const{ chalk, indent, summary, getStackTrace } = require('../utils.js');
const emitter = new (require('events'))();
const log = (string, pad=level, prefix)=>console.log(indent(string, pad*2, prefix));

let level = 0;

emitter.on('start', (cases, opts, flags)=>{
	if(opts.watch) console.log(chalk.yellow('⏱ Watch Mode Enabled ⏱ \n'));
	if(flags.only) console.log(chalk.yellow('⚠ Some tests flagged as only ⚠ \n'));

	level=0;
});
emitter.on('start_group', (name)=>{
	log(chalk.magenta(name));
	level++;
});
emitter.on('end_group', (name)=>{
	level--;
});
emitter.on('end_test', (name, result)=>{
	if(result === false){
		log(chalk.cyan(name));
	}
	if(result === true){
		log(chalk.green(`✔ ${name}`));
	}
	if(result instanceof Error){
		log(chalk.red(name));
		log(result.toString(), level+1, chalk.red('| '));
		getStackTrace(result).slice(0,3).map(({ name, file, line })=>{
			log(chalk.grey(`at ${name} in ${file}:${line}`), level+1, chalk.red('| '));
		});
	}
});
emitter.on('finish', (results)=>{
	const{ passed, failed, skipped } = summary(results);
	console.log(chalk.grey('______________________________\n'));
	console.log(
		chalk.green(`${passed} passed`),
		chalk.red(`${failed} failed`),
		chalk.cyan(`${skipped} skipped`),
	)
	level=0;
});

module.exports = emitter