const Assert = require('./assert.js');

const hasOnlyFlag = (cases)=>{
	const recur = (cases)=>{
		return!!Object.entries(cases).find(([name, test])=>{
			if(name[0]=='$') return true;
			if(typeof test == 'object') return recur(test);
		});
	};
	return recur(cases);
};

const runTest = async (test, opts={timeout : 2000})=>{
	try{
		Assert.armed = false;
		Assert.timeout = opts.timeout;
		const testResult = test(Assert);
		if(!(testResult instanceof Promise)) return true;
		return await Promise.race([
			testResult
				.then(()=>{
					return Assert.armed
						? new Error('Test failed: Not disarmed')
						: true
				})
				.catch(err=>new Error(err))
			,
			new Promise((resolve)=>{
				setTimeout(()=>resolve(new Error('Test failed: Timeout Error')), Assert.timeout)
			})
		]);
	}catch(err){
		return new Error(err);
	}
};

const runCases = async (cases, opts={})=>{
	opts = {
		emitter : { emit : ()=>{} },
		timeout : 2000,
		...opts
	};

	const recur = async (cases, flags)=>{
		const acc = {};

		for(const[name, test]of Object.entries(cases)){
			const flaggedOnly = name[0] == '$', flaggedSkip = name[0] == '_';
			const shouldSkip = flaggedSkip || flags.skip || (!flaggedOnly && flags.only);

			if(typeof test == 'object'){
				opts.emitter.emit('start_group', name);
				acc[name] = await recur(test, {
					only : flaggedOnly ? false : flags.only,
					skip : flags.skip || flaggedSkip
				})
				opts.emitter.emit('end_group', name);
			}

			if(typeof test == 'function'){
				opts.emitter.emit('start_test', name);
				const testResult = shouldSkip
					? false
					: await runTest(test, opts);
				opts.emitter.emit('end_test', name, testResult);
				acc[name] = testResult;
			}
		}
		return acc;
	}

	const flags = {
		only : hasOnlyFlag(cases),
		skip : false
	};

	opts.emitter.emit('start', cases, opts, flags);
	const results = await recur(cases, flags);
	opts.emitter.emit('finish', results);
	return results;
};

runCases.runTest = runTest;
runCases.assert = Assert;

module.exports = runCases;