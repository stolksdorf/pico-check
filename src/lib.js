const Assert = require('./assert.js');
const utils = require('./utils.js');

const Test = {
	createTestCase : (name, testScope, paramOpts={})=>{
		const testCase = {
			name,
			opts : paramOpts,
			run  : (runOpts={})=>{
				const opts = utils.merge(testCase.opts, runOpts);
				(opts.reporter && opts.reporter.startTest(testCase));
				let timeout;
				return new Promise((resolve, reject)=>{
					if(opts.skip || (opts.run_only && !opts.only)) return resolve(false);
					try {
						const testResult = testScope(Assert);
						if(!(testResult instanceof Promise)) return resolve();
						timeout = Assert.timeout(resolve, opts.timeout);
						testResult.then(resolve).catch((err)=>resolve(err));
					} catch (err){
						resolve(err instanceof Error ? err : new Error(err));
					}
				})
					.then((result = true)=>{
						clearTimeout(timeout);
						if(result instanceof Error) result.title = testCase.name;
						(opts.reporter && opts.reporter.endTest(testCase, result));
						return result;
					});
			}
		};
		return testCase;
	},
	createGroup : (name, paramOpts={})=>{
		const group = {
			name,
			opts  : paramOpts,
			tests : [],
			add   : (item)=>{
				if(typeof item == 'function') item = item.get();
				if(item.opts.only || item.opts.contains_only) group.opts.contains_only = true;
				group.tests.push(item);
				return group;
			},
			run : (runOpts={})=>{
				const opts = utils.merge(group.opts, runOpts);
				(opts.reporter && opts.reporter.startGroup(group));
				if(opts.contains_only) runOpts.run_only = true;
				return utils.sequence(group.tests, (test)=>{
					if(opts.skip) return test.run({ ...runOpts, skip: true });
					if(runOpts.run_only){
						if(opts.only && !opts.contains_only) return test.run({ ...runOpts, run_only: false });
						if(!(opts.contains_only || opts.only)) return test.run({ ...runOpts, skip: true });
					}
					return test.run(runOpts);
				})
					.then((results)=>{
						(opts.reporter && opts.reporter.endGroup(group, results));
						return results;
					});
			}
		};
		return group;
	}
};

module.exports = Test;
