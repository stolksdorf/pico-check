const check = require('../');

module.exports = async (t)=>{

	const {results} = await check([
		(t)=>t.pass(),
		(t)=>t.fail(),
		{
			_skipped : ()=>{},
			failed   : (t)=>t.fail()
		}
	], {logs : false});

	t.is(results[0], true);
	t.type(results[1], 'error');
	t.is(results[2]._skipped, false);
	t.type(results[2].failed, 'error');
}