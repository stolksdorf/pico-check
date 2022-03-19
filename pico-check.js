const sequence = async (obj, fn)=>{
	let res = {};
	return Object.entries(obj).reduce((a,[k,v])=>a.then(()=>fn(v,k).then((r)=>res[k]=r)),Promise.resolve()).then(()=>res);
}
const isSame = (a,b)=>(typeof a==='object')?Object.entries(a).every(([k,v])=>isSame(v,b[k])) : a===b;

const runTest = async (test, timeout=2000)=>{
	try{
		const Harness = {
			timeout,
			type    : (val, type, msg) => {
				let _type = typeof val;
				if(Array.isArray(val)) _type = 'array';
				if(val instanceof Error) _type = 'error';
				if(type!==_type){ throw new Error(msg || `Value is a ${_type}, not ${type}`); }
			},
			is      : (a,b, msg)=>{ if(!isSame(a,b)){ throw new Error(msg || `${a} does not equal ${b}`)} },
			not     : (a,b)=>{ if(isSame(a,b)){ throw new Error(`${a} does equal ${b}`)} },
			ok      : (a, msg)=>{ if(!a){ throw new Error(msg || `${a} is not truthy`)} },
			pass    : ()=>{},
			fail    : (msg=`Test failed manually`)=>{throw new Error(msg);},
			armed : false,
		};
		Harness.wait = new Promise((resolve, reject)=>{
			Harness.pass = resolve;
			Harness.reject = (msg=`Test rejected manually`)=>reject(msg);
		}).then(()=>true).catch((err)=>new Error(err));

		const testResult = test(Harness);
		if(!(testResult instanceof Promise)) return true;
		Harness.fail = Harness.reject;
		const result = await Promise.race([
			Harness.wait,
			testResult.then(()=>true).catch(err=>new Error(err)),
			new Promise((r)=>{setTimeout(()=>r(new Error('Test failed: Timeout Error')), Harness.timeout)})
		]);
		if(Harness.armed) return new Error('Test failed: Never disarmed.');
		return result;
	}catch(err){
		if(!(err instanceof Error)) return new Error('Thrown a non-Error type. Could not get a stack trace.');
		return err;
	}
};

const hasOnlyFlag = (cases)=>{
	return !!Object.entries(cases).find(([name, test])=>{
		if(name.startsWith('$')) return true;
		if(typeof test == 'object') return hasOnlyFlag(test);
	});
};

const runCases = async (cases, opts={})=>{
	opts = {logs:true, timeout:2000, ...opts};
	const chalk = Object.entries({
			bright: 1,  grey : 90,  red:  31,
			green:  32, yellow:33, blue: 34,
			magenta:35, cyan:  36, white:37,
		}).reduce((acc, [name, id])=>{ return {...acc, [name]:(opts.logs?(txt, idt=0)=>{console.log(`${'  '.repeat(idt)}\x1b[${id}m${txt}\x1b[0m`)}:()=>{})}}, {})

	let skipped=0, passed=0, failed=0;
	let OnlyMode = hasOnlyFlag(cases);
	if(OnlyMode) chalk.yellow('⚠ Some tests flagged as only ⚠ \n');

	const log = (val, name, indent)=>{
		if(val===null){ return chalk.magenta(name, indent); }
		if(val===false){ skipped++; return chalk.cyan(`${name}`, indent); }
		if(val===true){ passed++; return chalk.green(`✔ ${name}`, indent); }
		failed++;
		chalk.red(`❌ ${name}`, indent);
		if(opts.logs) console.log(val);
	};

	const loop = async (obj, indent=0, skip=false, force=false)=>{
		return await sequence(obj, async (test, name)=>{
			let shouldSkip = skip || name.startsWith('_');
			let onlyName = name.startsWith('$')||name.endsWith('$');
			if(typeof test == 'object'){
				log(null, name, indent);
				return await loop(test, indent+1, shouldSkip, force||onlyName);
			}
			if(shouldSkip || (!onlyName && OnlyMode && !force)){
				log(false, name, indent);
				return false;
			}
			const result = await runTest(test, opts.timeout);
			log(result, name, indent);
			return result;
		});
	};
	const results = await loop(cases);
	if(opts.logs){
		chalk.grey('______________________________\n');
		chalk.green(`${passed} passed`);
		chalk.red(`${failed} failed`);
		chalk.cyan(`${skipped} skipped`);
	}
	return {skipped, passed, failed, results};
};
runCases.runTest = runTest;
module.exports = runCases;