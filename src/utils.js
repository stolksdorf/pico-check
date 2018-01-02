const path = require('path');

// const internalPaths = Object.keys(process.binding('natives'))
// 	.concat(['bootstrap_node', 'node'])
// 	.map((name)=>new RegExp(`${name}\\.js:\\d+:\\d+`))
// 	.concat([new RegExp(`\\\\pico-test\\\\src\\\\`)]);

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
			}
			else if(result === true){  summary.passed++; }
			else if(result === false){ summary.skipped++; }
			return summary;
		}, {passed : 0, failed : 0, skipped : 0, passing : true, errors: []});


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
	},
	// parseError : (err)=>{
	// 	let stack = err.stack.split('\n')
	// 		.filter((line)=>!internalPaths.some((regex)=>regex.test(line)))
	// 		.map((line)=>line.replace(process.cwd(), '.'))
	// 	const matches = /\((.*):(\d+):(\d+)/.exec(stack[1]);
	// 	return {
	// 		file  : matches[1],
	// 		stack : stack.join('\n'),
	// 		line  : Number(matches[2]),
	// 		col   : Number(matches[3])
	// 	};
	// },
};

module.exports = Utils;