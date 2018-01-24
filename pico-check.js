const Test  = require('./src/lib.js');
const utils = require('./src/utils.js');
const path  = require('path');
delete require.cache[require.resolve('./pico-check.js')];

const GroupBuilder = (name, groupOpts={})=>{
	const group = Test.createGroup(name, groupOpts);
	const TestBuilder = (baseOpts={})=>{
		const testcase = function(name, testFunc, opts={}){
			group.add(Test.createTestCase(name, testFunc, utils.merge(baseOpts, opts)));
		};
		const addCmd = (name, cmdOpts)=>{
			testcase[name] = (...args)=>{
				const result = TestBuilder(utils.merge(baseOpts, cmdOpts));
				return args.length ? result(...args) : result;
			};
		};
		addCmd('only', { only: true });
		addCmd('skip', { skip: true });
		addCmd('todo', { todo: true });
		testcase.group = (name, scope, opts)=>{
			const newBuilder = GroupBuilder(name, utils.merge(baseOpts, opts));
			scope(newBuilder);
			group.add(newBuilder.get());
			return newBuilder;
		};
		testcase.run = (...args)=>group.run(...args);
		testcase.get = ()=>group;
		testcase.add = (item)=>group.add(item);
		return testcase;
	};
	return TestBuilder();
};

module.exports = GroupBuilder(path.relative(process.cwd(), module.parent.filename));