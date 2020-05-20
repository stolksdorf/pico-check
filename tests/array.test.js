const check = require('../src/pico-check.js');

module.exports = async (t)=>{

	const res = await check([
		(t)=>t.pass(),
		(t)=>t.fail(),
		{
			_skipped : ()=>{},
			failed   : (t)=>t.fail()
		}
	])

	t.is(res[0], true);
	t.err(res[1]);
	t.is(res[2]._skipped, false);
	t.err(res[2].failed);
}