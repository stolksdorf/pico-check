const path = require('path');
const chalk = require('chalk');

//Polyfills
if(!String.prototype.padEnd) {
	String.prototype.padEnd = function padEnd(pad=1, char=' ') {
		if(this.length > pad) return String(this);
		pad = pad-this.length;
		if(pad > char.length) char += char.repeat(pad/char.length);
		return String(this) + char.slice(0, pad);
	};
}
if(!String.prototype.padStart) {
	String.prototype.padStart = function padStart(pad=1, char=' ') {
		if(this.length > pad) return String(this);
		pad = pad-this.length;
		if(pad > char.length) char += char.repeat(pad/char.length);
		return char.slice(0, pad) + String(this);
	};
}

const Utils = {
	merge           : (...args)=>Object.assign({}, ...args),
	flatMap         : (list, fn)=>[].concat(...list.map(fn)),
	relativePath    : (modulePath)=>path.resolve(process.cwd(), modulePath),
	requireRelative : (modulePath)=>require(Utils.relativePath(modulePath)),
	isObjectLike    : (...args)=>!!args.find((val)=>val != null && typeof val == 'object'),
	indent          : (string, pad=1)=>{
		if(typeof pad == 'number') pad = new Array(pad+1).join(' ');
		return string.split('\n').map((line)=>`${pad}${line}`).join('\n');
	},
	sequence : (list, fn)=>{
		return list.reduce((prom, val, key)=>{
			return prom.then((result)=>{
				let temp = fn(val, key);
				temp = (temp instanceof Promise ? temp : Promise.resolve(temp));
				return temp.then((value)=>{
					result.push(value);
					return result;
				});
			});
		}, Promise.resolve([]));
	},
	getSummary : (results)=>{
		const mergeSummaries = (sum1, sum2)=>({
			passed  : sum1.passed  + sum2.passed,
			failed  : sum1.failed  + sum2.failed,
			skipped : sum1.skipped + sum2.skipped,
			passing : sum1.passing && sum2.passing,
			errors  : sum1.errors.concat(sum2.errors)
		});
		return results.reduce((summary, result)=>{
			if(Array.isArray(result)) return mergeSummaries(summary, Utils.getSummary(result));
			if(result instanceof Error){
				summary.failed++;
				summary.errors.push(result);
				summary.passing = false;
			} else if(result === true){  summary.passed++; } else if(result === false){ summary.skipped++; }
			return summary;
		}, { passed: 0, failed: 0, skipped: 0, passing: true, errors: [] });
	},
	printSummary : ({ passed, skipped, failed })=>{
		console.log(chalk.greenBright(`${`✓ ${passed}`.padEnd(4)} passed`));
		console.log(chalk.cyanBright(`${`• ${skipped}`.padEnd(4)} skipped`));
		console.log(chalk.redBright(`${`X ${failed}`.padEnd(4)} failed`));
	},
	printDivider : ()=>console.log(chalk.grey('──────────────────────────────\n'))
};

module.exports = Utils;
