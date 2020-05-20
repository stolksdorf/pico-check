const check = require('../src/engine.js');
const runTest = check.runTest;

module.exports = {

	skipped : async (t)=>{

		const res = await check({
			_should_skip : {
				a      : ()=>{},
				b      : ()=>{},
				nested : {
					c : ()=>{}
				}
			},
			nested : {
				_skipped_fail : (t)=>t.fail(),
				pass          : ()=>{},
			},
			fail : (t)=>t.fail()
		})

		t.is(res._should_skip.a, false);
		t.is(res._should_skip.b, false);
		t.is(res._should_skip.nested.c, false);

		t.is(res.nested._skipped_fail, false);
		t.is(res.nested.pass, true);

		t.err(res.fail);
	},

	only : async (t)=>{


		const res = await check({
			$only : {
				a      : ()=>{},
				nested : {
					c        : ()=>{},
					_skipped : ()=>{}
				}
			},
			nested : {
				$a : ()=>{},
				b  : ()=>{}
			},
			skipped : (t)=>t.fail(),
			$fail   : (t)=>t.fail(),

		})


		t.is(res.$only.a, true);
		t.is(res.$only.nested.c, true);
		t.is(res.$only.nested._skipped, false);

		t.is(res.nested.$a, true);
		t.is(res.nested.b, false);

		t.is(res.skipped, false);
		t.err(res.$fail);

	}




}