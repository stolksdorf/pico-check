const path = require('path');

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
	isObjectLike    : (val1, val2)=>{
		return (val1 != null && typeof val1 == 'object') ||
			   (val2 != null && typeof val2 == 'object');
	},
	indent : (string, pad=1)=>{
		if(typeof pad == 'number') pad = new Array(pad).join(' ');
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
		//let summary = {passed : 0, failed : 0, skipped : 0, passing : true, errors: [] };
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


		// results.map((result)=>{
		// 	if(result instanceof Error){
		// 		summary.failed++;
		// 		summary.errors.push(result);
		// 		summary.passing = false;
		// 	}
		// 	else if(result === true){  summary.passed++; }
		// 	else if(result === false){ summary.skipped++; }
		// 	else summary = mergeSummaries(summary, Utils.getSummary(result));
		// });
		// return summary;
	}
};

module.exports = Utils;