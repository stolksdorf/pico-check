const check = require('./simple.js');

// check(async (t)=>{
// 	console.log('running')
// 	setTimeout(()=>{
// 		console.log('running3')
// 		t.reject();
// 	}, 1500)

// 	console.log('running2');
// 	return t.wait;
// })
// .then(res=>{
// 	console.log('DONE')
// 	console.log(res)
// });


check({
	foo : {
		bar : {
			goo : (t)=>{
				t.pass();
			}
		},
		$loo : (t)=>{
			t.fail('oh hello');
		}
	},
	doop : (t)=>{

		setTimeout(()=>{
			t.fail('yoyoyoy');
		}, 2000)


		return t.wait;
	},
	temp : async (t)=>{

		t.fail('async fail test');
	}
})



// const res = check({
// 	foo : {
// 		bar : {
// 			_goo : (t)=>{
// 				t.pass();
// 			},
// 			shoop : ()=>{}
// 		},
// 		$loo : (t)=>{
// 			t.pass('oh hello');
// 		}
// 	},
// 	doop : (t)=>{

// 		setTimeout(()=>{
// 			t.pass('yoyoyoy');
// 		}, 2000);

// 		return t.wait;
// 	},

// 	temp : async (t)=>{
// 		t.pass('async fail test');
// 	},
// 	temp2$ : {
// 		temp3: ()=>{},
// 		temp4$ : ()=>{}
// 	}
// })

// res.then(foo=>console.log(foo))