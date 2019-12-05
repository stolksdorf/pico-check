const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Assert = require('../src/assert.js');

const codeDiff = require('../src/codediff.js');
const utils = require('../src/utils.js');


const InternalPaths = Object.keys(process.binding('natives')).concat(['bootstrap_node', 'node']).map((name) => `${name}.js`);
const getStack = (err) => {
	return err.stack.split('\n').reduce((stack, raw) => {
		const[_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		if(!!file && !InternalPaths.includes(file)){
			stack.push({ name, file : file.replace(process.cwd(), '').slice(1), line : Number(line), col : Number(col), raw });
		}
		return stack;
	}, []);
};

const getTrace = (err, offset = 0) => {
	const stack = getStack(err)
		.filter(({ file }) => {
			return file.indexOf(`pico-check${require('path').sep}src`) === -1;
		})
		.slice(offset);
	const res = stack[0] || {};
	if(res.file) res.file = path.relative(process.cwd(), res.file);
	res.stack = stack.map(({ raw }) => raw).join('\n');
	return res;
};

const codeSnippet = (file, line, col, indent = '') => {
	const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split('\n');
	const renderLine = (lineNum, color = 'grey') => {
		return chalk[color](`${lineNum}:`.padEnd(5)) + code[lineNum - 1].replace(/\t/g, '  ');
	};
	return[
		indent + renderLine(line - 1),
		indent + chalk.bgRed.bold(renderLine(line, 'white')),
		indent + renderLine(line + 1),
	].join('\n');
};

module.exports = (error) => {
	const trace = getTrace(error);
	const name = error.title || error.message;
	const location = trace.file
		? chalk.grey(`${trace.file}:${trace.line}`)
		: chalk.grey(`${error.test.info.file}:${error.test.info.line}`);
	const getReport = () => {
		if(Assert.isForcedFail(error))return;
		if(error instanceof Assert.AssertionError && error.generatedMessage){
			return utils.indent(`Difference: \n${codeDiff(error.actual, error.expected)}`, 5);
		}
	};
	//TODO: this needs to be improved, break into a bunch of conditionals
	return(
		`${[
			`${chalk.redBright('  X')} ${chalk.bold(name)}  ${location}\n`,
			trace.file ? `${codeSnippet(trace.file, trace.line, trace.col, '    ')  }\n` : false,
			error.message && !error.generatedMessage ? utils.indent(error.message, 5) : false,
			getReport(),
			utils.indent(trace.stack, 5),
		]
			.filter((x) => !!x)
			.join('\n')  }\n\n`
	);
};
