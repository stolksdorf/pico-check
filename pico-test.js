const pathRelative = require('path').relative
const cwd = process.cwd();


const createTimeout = (cb, time=500)=>{
	setTimeout(()=>{
		cb(new Error('Async test timed out'));
	}, time)
}

//TODO: Apparently there's an assert lib?! Let's use that!!
const assert = require('assert');
const Assert = Object.assign({}, assert, {
	pass : ()=>{},
	fail : (msg = 't.fail was called')=>assert.fail(msg)
});

const utils = require('./utils.js');

const report = (reporter, ...args)=>{
	if(typeof reporter === 'function') reporter(...args);
}


const Test = {
	createTestCase : (name, testFunc, opts={})=>{
		const testCase = {
			name,
			//id : currentID++,  //TODO: Maybe don't need this?
			opts,
			//passing : null,
			//error : null,
			run : (runOpts={})=>{
				report(runOpts.reporter, 'start_test', testCase);
				return new Promise((resolve, reject)=>{
					const caught = (err)=>{
						//TODO: Add in a test name?
						if(!testCase.error) testCase.error =  err;
						resolve();
					}
					try{
						const testResult = testFunc(Assert);
						if(testResult instanceof Promise) createTimeout(caught, opts.timeout);
						(testResult || Promise.resolve())
							.then(()=>caught(false))
							.catch((err)=>{
								caught(err)
							})
					}catch(err){
						caught(err);
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
	},

	//TODO: Possibly rename and use per file
	createBuilder : (name, opts={})=>{
		if(!name) name = utils.getFilename(); //pathRelative(cwd, module.parent.filename);
		let group = Test.createGroup(name, opts);
		const makeBuilder = (defaultOpts=opts)=>{
			const testBuilder = (name, testFunc, opts=defaultOpts)=>{
				group.add(Test.createTestCase(name, testFunc, opts))
			};
			testBuilder.only = ()=>makeBuilder(Object.assign({}, defaultOpts, {only : true}));
			testBuilder.skip = ()=>makeBuilder(Object.assign({}, defaultOpts, {skip : true}));
			testBuilder.todo = ()=>makeBuilder(Object.assign({}, defaultOpts, {todo : true}));

			testBuilder.group = (name, scope, opts=defaultOpts)=>{
				const newBuilder = Test.createBuilder(name, opts);
				group.add(newBuilder.get());
				try{
					scope(newBuilder);
				}catch(e){
					newBuilder.get().passing = false;
					newBuilder.get().error = e;
				}
			};
			//TODO: Make into passing in opts
			testBuilder.run = (...args)=>group.run(...args);
			testBuilder.get = ()=>group;
			testBuilder.add = (item)=>group.add(item);
			return testBuilder;
		};
		return makeBuilder();
	},
};


//TODO: Possible rmeove, come up with a better name for getting a builder?
module.exports = Object.keys(Test)
	.reduce((builder, key)=>{
		builder[key] = Test[key];
		return builder;
	}, Test.createBuilder);

