const fs     = require('fs');
const path   = require('path');
const chalk  = require('chalk');
const Assert = require('../src/assert.js');

const codeDiff = require('../src/codediff.js');
//const codeDiff = require('concordance').diff;
const utils = require('../src/utils.js');

const InternalPaths = Object.keys(process.binding('natives'))
	.concat(['bootstrap_node', 'node'])
	.map((name)=>new RegExp(`${name}\\.js:\\d+:\\d+`))
	.concat([
		new RegExp(`\\\\pico-check\\\\src\\\\`),
		new RegExp(`<anonymous>`)
	]);

const parseError = (err)=>{
	const newStack = err.stack.split('\n')
		.filter((line)=>!InternalPaths.some((regex)=>regex.test(line)))
		.map((line)=>line.replace(process.cwd(), '.'));
	const sourceLine = newStack.find((line)=>/\((.*):(\d+):(\d+)/.test(line));
	if(!sourceLine) return {
		stack : err.stack,
		file  : false,
		line  : '??',
		col   : '??'
	};
	const matches = /\((.*):(\d+):(\d+)/.exec(sourceLine);
	return {
		file  : matches[1],
		stack : newStack.join('\n'),
		line  : Number(matches[2]),
		col   : Number(matches[3])
	};
};

const codeSnippet = (file, line, col, indent='')=>{
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum, color='grey')=>chalk[color](`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');
	return [
		indent + renderLine(line-1),
		indent + chalk.bgRed.bold(renderLine(line, 'white')),
		indent + renderLine(line+1)
	].join('\n');
};

module.exports = (error, title='')=>{
	const err = parseError(error);
	const name = title || error.title || error.message;
	const location = err.file ? chalk.grey(`${err.file}:${err.line}`) : '';
	const getReport = ()=>{
		if(Assert.isForcedFail(error)) return utils.indent(error.message, 5);
		if(error instanceof Assert.AssertionError) return utils.indent(`Difference: \n${codeDiff(error.actual, error.expected)}`, 5);
		return utils.indent(err.stack, 5); //TODO: possibly color this?
	};
	return `${chalk.redBright('  X')} ${name}  ${location}\n
${err.file ? codeSnippet(err.file, err.line, err.column, '    ') : ''}\n
${getReport()}\n`;
};