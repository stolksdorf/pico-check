#!/usr/bin/env node

const runCases = require('./pico-check.js');
const{ summary, watchSource, clearConsole } = require('./utils.js');
const reporter = require('./basic.reporter');


let target = false;
const flags = new Set();
process.argv.map((arg)=>{
	if(arg[0] == '-'){
		flags.add(arg.replace(/-/g, ''))
	}else{
		target = arg;
	}
});


if(!target)throw'Must provide a filepath to test cases';
target = require.resolve(target, { paths : [process.cwd()]});


if(flags.has('watch')){
	watchSource(target, async (cases)=>{
		clearConsole();
		try{
			await runCases(cases, { emitter : reporter, watch : true });
		}catch(err){
			console.log(err);
		}
	});
}else{
	runCases(require(target), { emitter : reporter })
		.then((results)=>{
			const{ failed } = summary(results);
			process.exit(failed === 0 ? 0 : 1);
		})
		.catch((err)=>{ console.log(err) });
}