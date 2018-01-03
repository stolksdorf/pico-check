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


const codeSnippetHighlight = (file, line, col, indent='')=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum)=>indent + chalk.grey(`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');
	return [
		renderLine(line-1),
		chalk.redBright(renderLine(line+0)),
		renderLine(line+1),
	].join('\n')
};

const codeSnippetBar = (file, line, col, indent='')=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum, color='grey')=>chalk[color](`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');
	return [
		indent + renderLine(line-1),
		indent + chalk.bgRed.bold(renderLine(line, 'white')),
		indent + renderLine(line+1)
	].join('\n')
};

module.exports = (error, title='')=>{
	const err = parseError(error);

	const name = (title ? `${title} ` : '')
	const location = chalk.grey(`${err.file}:${err.line}`);
	const snippet = codeSnippetBar(err.file, err.line, err.column, '    ');

	let report = '';
	if(Assert.isForcedFail(error)){
		report = indent(error.message, '    ');
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