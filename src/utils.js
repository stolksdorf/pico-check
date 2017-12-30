// const pathRelative = require('path').relative
// const cwd = process.cwd();
// const chalk = require('chalk');

const stack = require('stack-utils');
const path = require('path');


//pathRelative(cwd, module.parent.filename);

const Utils = {
	merge        : (...args)=>Object.assign({}, ...args),
	flatMap      : (list, fn)=>[].concat(...list.map(fn)),
	relativePath : (modulePath)=>path.resolve(process.cwd(), modulePath),
	requireRelative : (modulePath)=>require(Utils.relativePath(modulePath)),
	isObjectLike : (val1, val2)=>{
		return (val1 != null && typeof val1 == 'object') ||
			   (val2 != null && typeof val2 == 'object');
	},
	sequence : (list, fn)=>{
		return list.reduce((prom, val, key)=>{
			return prom.then((result)=>{
				let temp = fn(val, key);
				temp = (temp instanceof Promise ? temp : Promise.resolve(temp))
				return temp.then((value)=>{
					result.push(value);
					return result;
				});
			});
		}, Promise.resolve([]))
	},
	getSummary : (results)=>{
		let summary = {passed : 0, failed : 0, skipped : 0, passing : true, errors: [] };
		const mergeSummaries = (sum1, sum2)=>({
			passed  : sum1.passed  + sum2.passed,
			failed  : sum1.failed  + sum2.failed,
			skipped : sum1.skipped + sum2.skipped,
			passing : sum1.passing && sum2.passing,
			errors  : sum1.errors.concat(sum2.errors)
		});
		results.map((result)=>{
			if(result instanceof Error){
				summary.failed++;
				summary.errors.push(result);
				summary.passing = false;
			}
			else if(result === true){  summary.passed++; }
			else if(result === false){ summary.skipped++; }
			else{
				summary = mergeSummaries(summary, Utils.getSummary(result));
			}
		})
		return summary;
	},
	processError : (err, testName = false)=>{
		//console.log(err);

		return err;
	},
};

module.exports = Utils;