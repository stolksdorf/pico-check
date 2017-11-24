const test = require('ava');


test('neato', t => {
	t.deepEqual([1, 2], [1, 2]);
});

test('I am a longer quote', (t)=>{
	t.fail()
});


test('I am a longer quote', (t)=>{
	t.is([1, 2], [1, 2]);
});

test('I am a longer quote', (t)=>{
	throw 'fancy'
});