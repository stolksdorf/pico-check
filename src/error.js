const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Assert = require('../src/assert.js');

const codeDiff = require('../src/codediff.js');
//const codeDiff = require('concordance').diff;
const utils = require('../src/utils.js');

// const InternalPaths = Object.keys(process.binding('natives'))
// 	.concat(['bootstrap_node', 'node'])
// 	.map((name) => new RegExp(`${name}\\.js:\\d+:\\d+`))
// 	.concat([new RegExp(`\\\\pico-check\\\\src\\\\`), new RegExp(`<anonymous>`)]);



// const parseError = (err) => {
// 	const newStack = (err.stack || '')
// 		.split('\n')
// 		.filter((line) => !InternalPaths.some((regex) => regex.test(line)))
// 		.map((line) => line.replace(process.cwd(), '.'));
// 	console.log('STACK', newStack);
// 	const sourceLine = newStack.find((line) => /\((.*):(\d+):(\d+)/.test(line));
// 	if(!sourceLine)
// 		return{
// 			stack : err.stack || '',
// 			file  : false,
// 			line  : '??',
// 			col   : '??',
// 		};
// 	const matches = /\((.*):(\d+):(\d+)/.exec(sourceLine);
// 	return{
// 		file  : matches[1],
// 		stack : newStack.join('\n'),
// 		line  : Number(matches[2]),
// 		col   : Number(matches[3]),
// 	};
// };

const InternalPaths = Object.keys(process.binding('natives')).concat(['bootstrap_node', 'node']).map((name) => `${name}.js`);
const getStack = (err)=>{
	const isNonInternal = (file)=>!!file && !InternalPaths.includes(file);
	return err.stack.split('\n').reduce((stack, raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		if(isNonInternal(file)){
			stack.push({name, file, line:Number(line), col:Number(col), raw})
		}
		return stack;
	}, []);
};

const getTrace = (err, offset=0)=>{
	const stack = getStack(err).filter(({file})=>{
		return file.indexOf(`pico-check${require('path').sep}src`) === -1
	}).slice(offset);
	const res = stack[0] || {};
	if(res.file) res.file = path.relative(process.cwd(), res.file)
	res.stack = stack.map(({raw})=>raw).join('\n')
	return res;
}

// //Pass either an error object or an offset for the trace.
// const getTrace = (offsetOrError = 0)=>{

// 	const stack = getStack(offsetOrError)

// 	console.log('STACK', stack);


// 	console.log('----------');
// 	console.log(offsetOrError.stack);
// 	console.log('----------');
// 	console.log(offsetOrError.message);
// 	console.log('----------');
// 	console.log(offsetOrError.title);
// 	console.log('----------');


// 	const stackline = (offsetOrError instanceof Error)
// 		? offsetOrError.stack.split('\n')[1]
// 		: (new Error()).stack.split('\n')[Number(offsetOrError) + 2];
// 	let name, loc = stackline.replace('at ', '').trim();
// 	const res = /(.*?) \((.*?)\)/.exec(loc);
// 	if(res){ name = res[1]; loc = res[2]; }
// 	console.log(res);
// 	console.log(loc);
// 	const [_, filename, line, col] = /(.*?):(\d*):(\d*)/.exec(loc);
// 	return { filename, name, line, col };
// }

const codeSnippet = (file, line, col, indent = '') => {
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum, color = 'grey') => {
		return chalk[color](`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');
	}
	return[
		indent + renderLine(line - 1),
		indent + chalk.bgRed.bold(renderLine(line, 'white')),
		indent + renderLine(line + 1),
	].join('\n');
};

module.exports = (error, test) => {
	const trace = getTrace(error);
	const name = error.title || error.message;
	const location = trace.file
		? chalk.grey(`${trace.file}:${trace.line}`)
		: chalk.grey(`${test.info.file}:${test.info.line}`);
	const getReport = () => {
		if(Assert.isForcedFail(error)) return;
		if(error instanceof Assert.AssertionError && error.generatedMessage){
			return utils.indent(`Difference: \n${codeDiff(error.actual, error.expected)}`, 5);
		}
	};
	//TODO: this needs to be improved, break into a bunch of conditionals
	return [
		`${chalk.redBright('  X')} ${chalk.bold(name)}  ${location}\n`,
		trace.file ? codeSnippet(trace.file, trace.line, trace.col, '    ') + '\n' : false,
		error.message && !error.generatedMessage ? utils.indent(error.message, 5) : false,
		getReport(),
		utils.indent(trace.stack, 5)
	].filter(x=>!!x).join('\n') + '\n\n'
};
