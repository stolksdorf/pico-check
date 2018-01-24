const utils = require('./utils.js');
const assert = require('assert');

const failMsg = 'Test failed via t.fail()';

const Assert = Object.assign({}, assert, {
	is   : (act, exp, msg)=>(utils.isObjectLike(act, exp) ? assert.deepEqual(act, exp, msg)    : assert.equal(act, exp, msg)),
	not  : (act, exp, msg)=>(utils.isObjectLike(act, exp) ? assert.notDeepEqual(act, exp, msg) : assert.notEqual(act, exp, msg)),
	pass : (msg)=>assert.ok(true, msg),
	fail : (msg=failMsg)=>assert.ok(false, msg),
	no   : (act, msg)=>assert.ok(!act, msg),

	//TODO: Might nee dto throw and catch here to get stack trace
	timeout      : (resolve, time)=>setTimeout(()=>resolve(new Error('Async timeout')), time),
	isForcedFail : (err)=>err.message===failMsg
});

module.exports = Assert;