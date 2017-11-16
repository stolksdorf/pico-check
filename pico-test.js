const pathRelative = require('path').relative
const cwd = process.cwd();

/* FIXME:
- Don't expose raw functions, just do call objects for now
- Have the files call an instance of a group, to get the scope right
- have a run function on a group that runs all sub tests and groups
- run function takes an event reporter, passes it down to emit out test events
- maybe an opts call passed down to

- Two major types: Group and Assertion

*/

/* Shower Notes
- Ditch plan, async tests must return a promise
- look int promise.race for making a timed promise util
- todo, skip, etc. should be functions. Simplifies the inheritance a ton
- the assertion runner should return a simple promise, in the test handler it has access to the test event mitter
- The assertion runner stops as soon as it has a failaure
-


/*
- Test cases shouldn't have access to the reporter
- Test Cases simply return promises



*/




// const getTimedReject = (time=500)=>{
// 	return new Promise((resolve,reject)=>{
// 		setTimeout(()=>{
// 			reject('Async test timed out')
// 		}, time)
// 	});
// };

//let currentID = 0;

const createTimeout = (cb, time=500)=>{
	setTimeout(()=>{
		cb(new Error('Async test timed out'));
	}, time)
}

//TODO: Apparently there's an assert lib?! Let's use that!!
const assert = require('assert');
const Assert = {
	passing
	fail
	equal
	notEqual
	deepEqual
	deepEqual
}

const utils = require('./utils.js');


const Test = {
	//TODO: make a separate lib?
	// createError : (msg, details)=>{
	// 	//Clean up the stack trace

	// },

	// createAssertion : ()=>{
	// 	return {
	// 		pass : (msg)=>{},
	// 		fail : (msg='Assertion failed')=>{ throw new Error(msg); },
	// 		is   : (actual, expected, msg)=>{
	// 			if(actual !== expected){
	// 				//TODO: add meta
	// 				throw new Error(msg)
	// 			}
	// 		}
	// 	}
	// },


	createTestCase : (name, testFunc, opts={})=>{
		const testCase = {
			name,
			//id : currentID++,  //TODO: Maybe don't need this?
			opts,
			//passing : null,
			//error : null,
			run : (reporter=()=>{})=>{
				reporter('start_test', testCase);
				return new Promise((resolve, reject)=>{
					const caught = (err)=>{
						testCase.error = testCase.error || err;
						resolve();
					}
					try{
						const testResult = testFunc(assert.create());
						if(testResult instanceof Promise) createTimeout(caught, opts.timeout);
						(testResult || Promise.resolve())
							.then(()=>caught(false))
							.catch(caught)
					}catch(err){ caught(err); }
				})
				.then(()=>reporter('end_test', testCase))
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
			run : (reporter=()=>{})=>{
				reporter('start_group', group)
				return group.tests.reduce((prom, test)=>{
					return prom
						.then(()=>test.run(reporter))
						.then(()=>group.passing = (!group.passing ? false : !test.error))
				}, Promise.resolve())
				.then(()=>reporter('end_group', group))
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
			testBuilder.run = (reporter)=>group.run(reporter);
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

