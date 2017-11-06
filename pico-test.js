const pathRelative = require('path').relative
const cwd = process.cwd();

let tests = {};
let Tests = [];

/* FIXME:
- Don't expose raw functions, just do call objects for now
- Have the files call an instance of a group, to get the scope right
- have a run function on a group that runs all sub tests and groups
- run function takes an event emitter, passes it down to emit out test events
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




*/

const makeTest = (scope = [])=>{
	const Test = function(name, testFn, opts={}){
		//If a group name was not set, it uses the file path
		// if(!(this instanceof Test)) return new Test(name, testFn, opts);
		console.log('HERE', process.mainModule.children[process.mainModule.children.length-1].filename);
		if(!scope.length) scope = [pathRelative(cwd, process.mainModule.filename)]
		// this.opts = {
		// 	name : name,
		// 	file : pathRelative(cwd, process.mainModule.filename),
		// 	skip : false,
		// 	only : false,
		// 	group : false,
		// }
		Tests.push({
			name,
			scope,
			testFn,
			tests : []
		});
	};
	Test.group = (name, scopeFn)=>{
		if(!scope.length) scope = [pathRelative(cwd, process.mainModule.filename)]
		const temp = makeTest(scope.concat(name));
		scopeFn(temp);
	}
	Test.run = ()=>{
		console.log(Tests);
	}
	return Test;
}



const addTest = (scope, name, fn)=>{
	console.log('add test', scope, name);
}


const createTestInstance = (name)=>{
	let res = (name, testFn)=>{
	};
	res.group = createGroup
}

const createScope = (name, scopes=[])=>{
	const test = createTestFunction();
	test.run = ()=>{
	}
}


////////////////


const createAssertion = (onAssert=(state, msg, details)=>{}, onPlan=(num)=>{})=>{
	return {
		plan : (num)=>onPlan(num),
		pass : (msg)=>onAssert(true, msg),
		fail : (msg)=>onAssert(false, msg),
		is   : (actual, expected, msg)=>{
			onAssert(actual === expected, msg, {
				actual,
				expected
			})
		}
	}
};

const createTest = (name, testFn, opts)=>{
	let planCount = 0;
	let isPassing = true;
	const onAssert = (state, msg, details)=>{
	};
	const test = {
		run : ()=>{
			return new Promise((resolve)=>{
				//Do opts checks
				const assertion = createAssertion(onAssert);
				try{
					testFn(assertion);
					if(planCount === 0) resolve();
				}catch(e){
					//fire assertion.fail() with details
					resolve();
				}
			})
		}
	}
	return test;
}

const createGroup = (name, newScope)=>{

};


const createInstance = (name, opts)=>{
	let tests = [];

	const instance = {
		test : (name, testFn, opts={})=>{
			//possibly lift up some options
			tests.push({
				name,
				testFn,
				opts
			})
		},
		group : (name, scopeFn, opts)=>{
			let groupInstance = createInstance(name, opts);
			scopeFn(groupInstance)
			tests.push(groupInstance);
		},
		get : ()=>{
			return {
				name,
				tests
			}
		},
		run : ()=>{
			//DO opts checks
			tests.map((test)=>{

				if(run.testFn){

					run.testFn(createAssertion)
				}
			})
		}
	}
	return instance;
}

/*
- Test cases shouldn't have access to the emitter
- Test Cases simply return promises



*/


const getTimedReject = (time)=>new Promise((resolve,reject)=>setTimeout(()=>reject('Async test timeout'), time));


const Test = {
	// createTestTimeout : (assertion, time)=>{
	// 	return new Promise((resolve, reject)=>{
	// 		setTimeout(()=>reject('Async test timeout'), time)
	// 	})
	// },


	// createAssertion2 : (onAssert=(state, msg, details)=>{})=>{
	// 	return {
	// 		pass : (msg)=>onAssert(true, msg),
	// 		fail : (msg)=>onAssert(false, msg='Assetion failed'),
	// 		is   : (actual, expected, msg)=>{
	// 			onAssert(actual === expected, msg, {
	// 				actual,
	// 				expected
	// 			})
	// 		}
	// 	}
	// },

	createAssertion : ()=>{
		return {
			pass : (msg)=>{},
			fail : (msg='Assertion failed')=>{ throw new Error(msg); },
			is   : (actual, expected, msg)=>{
				if(actual !== expected){
					throw new Error(msg)
				}
			}
		}
	},


	createTestCase : (name, testFunc, opts={})=>{
		return {
			name,
			testFunc,
			opts,
			run : ()=>{
				try{
					const newAssert = Test.createAssertion();
					const testResult = testFunc(newAssert);
					return Promise.race([
						testResult,
						(testResult instanceof Promise)
							//TODO: Should be an opt
							? getTimedReject(500)
							: Promise.resolve()
					])
				}catch(e){
					return Promise.reject(e);
				}
			}
		}
	},

	createGroup : (name, opts={})=>{
		let tests = [];
		if(!opts.file) opts.file = process.mainModule.filename// pathRelative(cwd, process.mainModule.filename);
		//if(!name) name = opts.file;

		const makeBuilder = (defaultOpts=opts)=>{
			const testBuilder = (name, testFunc, opts=defaultOpts)=>{
				//console.log(name);
				//testBuilder into a create test case function
				tests.push(Test.createTestCase(name, testFunc, opts))
			};
			testBuilder.only = ()=>makeBuilder(Object.assign({}, defaultOpts, {only : true}));
			testBuilder.skip = ()=>makeBuilder(Object.assign({}, defaultOpts, {skip : true}));
			testBuilder.todo = ()=>makeBuilder(Object.assign({}, defaultOpts, {todo : true}));

			testBuilder.group = (name, scope, opts=defaultOpts)=>{
				const newGroup = Test.createGroup(name, opts);
				tests.push(newGroup);
				try{
					scope(newGroup);
				}catch(e){
					//TODO: handle this
				}
			};
			testBuilder.add = (testItem)=>tests.push(testItem),
			testBuilder.run = (emitter)=>{
				emitter('start', `Starting group: ${name}`);
				return tests.reduce((prom, test)=>prom.then(()=>test.run(emitter)), Promise.resolve());
			},
			testBuilder.get = ()=>{
				const parsedTests = tests.map((test)=>{
					//TODO: do checks for 'only'
					if(typeof test.group == 'function') return test.get();
					return test;
				})
				return {
					name,
					opts,
					isGroup : true,
					hasOnly : false,
					tests : parsedTests
				}
			};
			return testBuilder;
		};



		return makeBuilder();
	},
};

module.exports = Test;