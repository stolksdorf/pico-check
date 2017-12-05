const chalk = require('chalk');
const codeDiff = require('../codediff.js');
const assert = require('assert');


const StackUtils = require('stack-utils');
const stack = new StackUtils({cwd: process.cwd(), internals: StackUtils.nodeInternals()});

const pad = (string, pad='    ')=>(string + pad).substring(0, pad.length);



const fs = require('fs');
const path = require('path');

const codeSnippet = (file, line, col)=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum, color='grey')=>chalk[color](pad(lineNum+':')) + code[lineNum - 1].replace(/\t/g, '  ');
	return [renderLine(line-1), chalk.bgRed.bold(renderLine(line, 'white')), renderLine(line+1)].join('\n')
};


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
	let report = '';

	if(title) report = `${chalk.red('  X')} ${title}\n`;

	console.log(title);
	console.log(typeof error);
	console.log(typeof error.stack);
	console.log(error.stack);

	console.log('         ');
	return;
	console.log('CALLSITE', error.stack[0].getLineNumber());

	const cleanedStack = stack.clean(error.stack);

	console.log('STACK', cleanedStack);

	const loc = stack.parseLine(cleanedStack.split('\n')[0]);

	console.log(loc.file, loc.line);

	report += codeSnippet(loc.file, loc.line, loc.column);



	if(error instanceof assert.AssertionError){
		console.log('Difference');
		//console.log(indent(codeDiff(error.actual, error.expected)));

	}else{

		console.log();
	}

	console.log('RPOERT', report);

	return report;



	// Print Test Case name
	// Print filename where the error happened



	//Print the code snippet

	//If Assertion Error, use Concordance to print a pretty diff

	//If any other error, print a clean stack trace


}