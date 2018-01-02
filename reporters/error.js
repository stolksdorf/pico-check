const fs     = require('fs');
const path   = require('path');
const chalk  = require('chalk');
const Assert = require('../src/assert.js');

const codeDiff = require('../src/codediff.js');
const utils = require('../src/utils.js');

const internalPaths = Object.keys(process.binding('natives'))
	.concat(['bootstrap_node', 'node'])
	.map((name)=>new RegExp(`${name}\\.js:\\d+:\\d+`))
	.concat([new RegExp(`\\\\pico-test\\\\src\\\\`)]);

const parseError = (err)=>{
	let stack = err.stack.split('\n')
		.filter((line)=>!internalPaths.some((regex)=>regex.test(line)))
		.map((line)=>line.replace(process.cwd(), '.'))
	const matches = /\((.*):(\d+):(\d+)/.exec(stack[1]);
	return {
		file  : matches[1],
		stack : stack.join('\n'),
		line  : Number(matches[2]),
		col   : Number(matches[3])
	};
};

// TODO: Move to Utils?
const pad = (string, pad='    ')=>(string + pad).substring(0, pad.length);
const indent = (string, pad='')=>string.split('\n').map((line)=>`${pad}${line}`).join('\n');


const codeSnippet = (file, line, col, indent='')=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	//const renderLine = (lineNum, color='grey')=>indent + chalk[color](pad(`${lineNum}:`)) + code[lineNum - 1].replace(/\t/g, '  ');
	const renderLine = (lineNum)=>indent + chalk.grey(`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');

	/*Red number + indicator*/
	// return [
	// 	'    ' + chalk.grey(`${line - 1}:`.padEnd(5)) + code[line - 2].replace(/\t/g, '  '),
	// 	chalk.redBright('  > ' + chalk.redBright(`${line    }:`.padEnd(5))) + code[line - 1].replace(/\t/g, '  '),
	// 	'    ' + chalk.grey(`${line + 1}:`.padEnd(5)) + code[line - 0].replace(/\t/g, '  '),

	// ].join('\n')

	/* Red line */
	// return [
	// 	'    ' + chalk.grey(`${line - 1}:`.padEnd(5)) + code[line - 2].replace(/\t/g, '  '),
	// 	chalk.redBright('  > ' + chalk.grey(`${line    }:`.padEnd(5)) + code[line - 1].replace(/\t/g, '  ')),
	// 	'    ' + chalk.grey(`${line + 1}:`.padEnd(5)) + code[line - 0].replace(/\t/g, '  '),

	// ].join('\n')

	/* Red background */
	return [
		'    ' + chalk.grey(`${line - 1}:`.padEnd(5)) + code[line - 2].replace(/\t/g, '  '),
		chalk.bgRed.bold('    ' + `${line    }:`.padEnd(5) + code[line - 1].replace(/\t/g, '  ')),
		'    ' + chalk.grey(`${line + 1}:`.padEnd(5)) + code[line - 0].replace(/\t/g, '  '),

	].join('\n')
};

module.exports = (error, title='')=>{
	const err = parseError(error);

	const name = (title ? `${title} ` : '')
	const location = chalk.grey(` ${err.file}:${err.line}`);
	const snippet = codeSnippet(err.file, err.line, err.column, '   ');

	let report = '';
	if(Assert.isForcedFail(error)){
		report = 'Forced fail yo';
	}else if(error instanceof Assert.AssertionError){
		report = indent(`Difference: \n${codeDiff(error.actual, error.expected)}`, '    ');
	} else {
		//TODO; possibly color this?d
		report = indent(err.stack, '    ');
	}

	return `
${chalk.red('  X')} ${name}${location}

${snippet}

${report}

`;
};