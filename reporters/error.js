const chalk = require('chalk');
const codeDiff = require('../codediff.js');
const assert = require('assert');


const StackUtils = require('stack-utils');
const stack = new StackUtils({cwd: process.cwd(), internals: StackUtils.nodeInternals()});

const indent = (string, space='  ')=>string.replace(/^(?!\s*$)/mg, space);



const fs = require('fs');
const path = require('path');
const codeSnippet = (file, line, col)=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const lines = [code[line-2], code[line-1], code[line]].map((line)=>line.replace(/\t/g, '  '));

	"test".padEnd(5)

	return `${chalk.grey((line-1+':').padEnd(5))} ${lines[0]}
${chalk.bgRed(`${line}: ${lines[1]}`)}
${chalk.grey(line+1+':')} ${lines[2]}`



}


// used by mini in final results
//used by verbose

// Clean error stack trace
// Extract out file, line number, column number
//Write a code extracter
//Use concordance to do error diff if it is an assertion error
//

// https://github.com/avajs/ava/blob/master/lib/beautify-stack.js

// https://github.com/avajs/ava/blob/master/lib/code-excerpt.js


module.exports = (error, title='')=>{

	if(title) console.log(`${chalk.red('  X')} ${title}\n`);


	const cleanedStack = stack.clean(error.stack);

	const loc = stack.parseLine(cleanedStack.split('\n')[0]);

	console.log(loc.file, loc.line);

	console.log(codeSnippet(loc.file, loc.line, loc.column));


	if(error instanceof assert.AssertionError){
		console.log('Difference');
		console.log(indent(codeDiff(error.actual, error.expected)));

	}else{

		console.log();
	}



	// Print Test Case name
	// Print filename where the error happened



	//Print the code snippet

	//If Assertion Error, use Concordance to print a pretty diff

	//If any other error, print a clean stack trace


}