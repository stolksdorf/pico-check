/* TAP reporter */
/* Mostly a proof of concept on how to write different styles of reporters */
/* https://testanything.org/ */

const emitter = new (require('events'))();
let currentTestCase = 0;

emitter.on('start', (cases, opts, flags)=>{
	let totalCases = 0;
	const countCases = (obj)=>{
		if(typeof obj == 'object') return Object.values(obj).map(countCases);
		totalCases++;
	}
	countCases(cases);
	console.log(`1..${totalCases}`);

	currentTestCase = 0;
});
emitter.on('end_test', (name, result)=>{
	currentTestCase++;
	if(result === true) console.log(`ok ${currentTestCase} - ${name}`);
	if(result === false) console.log(`ok ${currentTestCase} - # SKIP ${name}`);
	if(result instanceof Error) console.log(`not ok ${currentTestCase} - ${name}`);
});

module.exports = emitter;