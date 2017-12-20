const Test = require('./lib.js');
const utils = require('./utils.js');
const path = require('path')
delete require.cache[require.resolve('./pico-test.js')];

const GroupBuilder = (name, groupOpts={})=>{
	let group = Test.createGroup(name, groupOpts);

	const TestBuilder = (baseOpts={})=>{
		const testcase = function(name, testFunc, opts={}){
			group.add(Test.createTestCase(name, testFunc, utils.merge(baseOpts, opts)))
		};

		const addCmd = (name, cmdOpts)=>{
			testcase[name] = (...args)=>{
				const result = TestBuilder(utils.merge(baseOpts, cmdOpts))
				return args.length ? result(...args) : result;
			};
		};
		addCmd('only', {only : true});
		addCmd('skip', {skip : true});
		addCmd('todo', {todo : true});

		testcase.group = (name, scope, opts)=>{
			const newBuilder = GroupBuilder(name, utils.merge(baseOpts, opts));
			group.add(newBuilder.get());
			scope(newBuilder);
			return newBuilder;
		};
		testcase.run = (...args)=>group.run(...args).then(utils.getSummary);
		testcase.get = ()=>group;
		testcase.add = (item)=>group.add(item);
		return testcase;
	};
	return TestBuilder();
}

const testFileName = path.relative(process.cwd(), module.parent.filename);
module.exports = GroupBuilder(testFileName);
