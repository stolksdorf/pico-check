
//TODO: Apparently there's an assert lib?! Let's use that!!
const assert = require('assert');
const Assert = Object.assign({}, assert, {
	pass : ()=>{},
	fail : (msg = 't.fail')=>assert.fail(msg),
	timeout : new Error('Async timeout')
});

//const utils = require('./utils.js');

const report = (reporter, ...args)=>{
	if(typeof reporter === 'function') reporter(...args);
}


const Test = {
	createTestCase : (name, testFunc, opts={})=>{
		const testCase = {
			name,
			opts,
			error : null,
			run : (runOpts={})=>{
				//TODO: merge runopts with reg opts
				report(runOpts.reporter, 'start_test', testCase);
				return new Promise((resolve, reject)=>{

					let timer;
					const finish = (err = false)=>{
						if(err && !testCase.error) testCase.error =  err;
						clearTimeout(timer);
						resolve(testCase);
					}
					try{
						console.log('RUNNING');
						const testResult = testFunc(Assert);
						console.log('TEST RESULT', testResult);
						if(!(testResult instanceof Promise)) return finish();
						timer = setTimeout(()=>finish(Assert.timeout), opts.timeout);
						testResult
							.then(()=>finish())
							.catch((err)=>finish(err))
					}catch(err){
						console.log('type 1', err instanceof Error);
						const temp = new Error(err)
						console.log(err);
						finish(new Error(err));
					}
				})
				.then(()=>report(runOpts.reporter, 'end_test', testCase))
				.then(()=>testCase);
			}
		};
		return testCase;
	},
	createGroup : (name, opts={})=>{
		const group = {
			name,
			opts,
			tests   : [],
			passing : true,
			add : (item)=>{
				if(typeof item == 'function') item = item.get();
				if(item.opts.only) group.opts.subonly = true;
				group.tests.push(item);
				return group;
			},
			run : (runOpts={}, root=false)=>{
				if(root) report(runOpts.reporter, 'start', group);
				report(runOpts.reporter, 'start_group', group);
				return group.tests.reduce((prom, test)=>{
					return prom
						.then(()=>test.run(runOpts))
						.then(()=>group.passing = (!group.passing ? false : !test.error))
				}, Promise.resolve())
				.then(()=>report(runOpts.reporter, 'end_group', group))
				.then(()=>{
					if(root) report(runOpts.reporter, 'end', group)
				})
				.then(()=>group)
			}
		}
		return group;
	}
};

module.exports = Test;
