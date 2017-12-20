const test = require('../pico-test.js');



test('Basic test', (t)=>{
	t.is(3, 2+1)
})


test.only('Only test', (t)=>t.pass())
test.skip('This is skipped test', (t)=>t.fail(), {skip: false})

test.skip().only('Skip only', ()=>{})
test.only().skip('Only Skip', ()=>{})


test.only().group('Grouped tests', (test)=>{
	test('should be skipped', (t)=>{});
	test.only('should be only and skipped', ()=>{});
})


console.dir(test.get(), {depth:null})

test.run().then((summary)=>console.log('summary', summary))



module.exports = test;