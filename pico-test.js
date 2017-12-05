const Test = require('./lib.js');
const utils = require('./utils.js');

//TODO: Possible rmeove, come up with a better name for getting a builder?
const CreateBuilder = (name, opts={})=>{
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
			const newBuilder = CreateBuilder(name, opts);
			group.add(newBuilder.get());
			try{
				scope(newBuilder);
			}catch(e){
				newBuilder.get().passing = false;
				newBuilder.get().error = e;
			}
		};
		testBuilder.run = (...args)=>group.run(...args);
		testBuilder.get = ()=>group;
		testBuilder.add = (item)=>group.add(item);
		return testBuilder;
	};
	return makeBuilder();
}

module.exports = CreateBuilder;
