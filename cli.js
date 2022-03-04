#!/usr/bin/env node




// process.argv.map((arg)=>{
// 	if(arg[0] == '-'){
// 		flags.add(arg.replace(/-/g, ''))
// 	}else{
// 		target = arg;
// 	}
// });




const fs = require('fs');


let temp;



target = require.resolve(target, { paths : [process.cwd()]});


const srcs = Object.keys(require.cache).filter(src=>src.indexOf('node_modules')==-1);
srcs.map((src)=>{ delete require.cache[src] });


const runSuite = ()=>{
	console.log('yo')
}

fs.watch(process.cwd(), (a,b)=>{
	console.log('yo',a,b);
	clearInterval(temp);
	temp = setTimeout(runSuite, 200);
});

