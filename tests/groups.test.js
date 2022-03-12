const check = require('../');

module.exports = {

	skipped : async (t)=>{
		const {results} = await check({
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
		}, {logs : false})

		t.is(results._should_skip.a, false);
		t.is(results._should_skip.b, false);
		t.is(results._should_skip.nested.c, false);

		t.is(results.nested._skipped_fail, false);
		t.is(results.nested.pass, true);

		t.type(results.fail, 'error');
	},

	only : async (t)=>{


		const {results} = await check({
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

		}, {logs : false})


		t.is(results.$only.a, true);
		t.is(results.$only.nested.c, true);
		t.is(results.$only.nested._skipped, false);

		t.is(results.nested.$a, true);
		t.is(results.nested.b, false);

		t.is(results.skipped, false);
		t.type(results.$fail, 'error');

	}




}