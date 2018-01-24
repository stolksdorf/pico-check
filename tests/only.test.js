const test = require('../pico-check.js');

test('basic', (t)=>{
	const pc = require('../pico-check.js');

	pc.only('A', (t)=>{});
	pc('B', (t)=>{});
	pc.only('C', (t)=>{});

	return pc.run()
		.then((res)=>t.is(res, [true, false, true]));
});

test('group', (t)=>{
	const pc = require('../pico-check.js');

	pc.group('A', (test)=>{
		test.only('Aa', (t)=>{});
		test('Ab', (t)=>{});
	});

	return pc.run()
		.then((res)=>t.is(res, [
			[
				true,
				false
			]
		]));
});


test('multigroup', (t)=>{
	const pc = require('../pico-check.js');

	pc.only().group('A', (test)=>{
		test('Aa', (t)=>{});
		test('Ab', (t)=>{});
	});
	pc.group('B', (test)=>{
		test('Ba', (t)=>{t.fail();});
	});

	return pc.run()
		.then((res)=>t.is(res, [
			[true, true],
			[false]
		]));
});

test('nested groups', (t)=>{
	const pc = require('../pico-check.js');

	pc.group('A', (test)=>{
		test.only('Aa', (t)=>{});
		test('Ab', (t)=>{});
		test.only().group('C', (test)=>{
			test('Ca', (t)=>{});
			test('Cb', (t)=>{});
		});
		test.only().group('D', (test)=>{
			test('Da', (t)=>{});
			test.only('Db', (t)=>{});
		});
	});
	pc.group('B', (test)=>{
		test('Ba', (t)=>{});
	});

	return pc.run()
		.then((res)=>{
			t.is(res, [
				[true, false,
					[true, true],
					[false, true]
				],
				[false]
			]);
		});
});


module.exports = test;