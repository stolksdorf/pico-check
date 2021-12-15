const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));
const avg = (arr)=>arr.reduce((a,v)=>a+v,0)/arr.length;

const benchmark = (funcs, cases, opts={ iterations : 1})=>{
	let result = {
		summary : {
			total : cases.length * opts.iterations,
		},
		funcs : {}
	};

	Object.entries(funcs).map(([name, func])=>{
		result.funcs[name] = { time : 0, errs : 0, mem  : 0 };
		let timeStart = Date.now();
		let memStart = process.memoryUsage().heapUsed;
		times(opts.iterations, ()=>{
			cases.map((c)=>{
				try{ func(c); }catch(err){
					result.summary.hasErrs = true;
					result.funcs[name].errs++;
				}
			});
		});
		result.funcs[name].time = Date.now() - timeStart;
		result.funcs[name].mem = process.memoryUsage().heapUsed - memStart;
	});
	const _time = Object.values(result.funcs).map(r=>r.time);
	result.summary = {
		min : Math.min(..._time),
		max : Math.max(..._time),
		avg : avg(_time)
	};
	Object.entries(result.funcs).map(([name, res])=>{
		result.funcs[name].score = (res.time - result.summary.min)/(result.summary.max - result.summary.min)
	});

	return result;
};


const chalk = Object.entries({
	bright :1,  grey  :90,  red :31,
	green  :32, yellow:33, blue :34,
	magenta:35, cyan  :36, white:37,
}).reduce((acc, [name, id])=>{ return {...acc, [name]:(txt)=>`\x1b[${id}m${txt}\x1b[0m`}}, {});

const pad = (str, length, char=' ')=>str + char.repeat(Math.floor(length-(str+'').length));

const report = (result)=>{
	const meterLength = 20;
	const longName = Math.max(...Object.keys(result.funcs).map(a=>a.length));

	Object.entries(result.funcs).map(([name, res])=>{
		const meter = '*'.repeat(res.score*(meterLength-1) + 1);
		let errs = res.errs == 0 ? '' : chalk.red(`${res.errs} errors`);
		let color = 'bright';
		if(res.time == result.summary.min) color = 'green';
		if(res.time == result.summary.max) color = 'red';
		console.log(`${chalk[color](pad(name, longName))} |${chalk[color](pad(meter, meterLength, ' '))}| ${res.time} ${errs}`);
	})
};

benchmark.report = (...args)=>report(benchmark(...args));

module.exports = benchmark;


/*
const res = benchmark({
	a : ()=>{},
	bernies : (foo)=>foo+4,
	bernie : (foo)=>foo+8,
	bern : (foo)=>{
		if(foo==6) throw 'oops'
		foo*4
	},
}, [
	3,4,5,6,7
], {iterations : 10000})
*/