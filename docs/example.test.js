const check = require('../');

//custom timeouts

//errors

//parametrized

//skips




const ExampleTests = {
	'testing addition' : (t)=>{
	    t.is(3 + 4, 7);
	  },
	  'async tests' : {
	    'promise check' : (t)=>{
	      // return request(api_url)
	      //   .then((result)=>{
	      //     t.is(result, {code : 200, body : { ok : true }});
	      //   });

	      t.is({code : 404}, {code : 200, body : { ok : true }});
	    },
	    'async/await' :  async (t)=>{
	      const bar = Promise.resolve('bar');
	      t.is(await bar, 'bar');
	    }
	  },
	  '_skipped test' : (t)=>t.fail()


}



check(ExampleTests, { emitter : require('../reporters/basic.reporter.js') })
.then((res)=>{
	//console.log(res)
})

//check(ExampleTests, { emitter : require('../src/tap.reporter.js') });

