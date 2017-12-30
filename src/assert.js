const utils = require('./utils.js');
const assert = require('assert');

const Assert = Object.assign({}, assert, {
	is   : (act, exp, msg)=>(utils.isObjectLike(act, exp) ? assert.deepEqual(act, exp, msg)    : assert.equal(act, exp, msg)),
	not  : (act, exp, msg)=>(utils.isObjectLike(act, exp) ? assert.notDeepEqual(act, exp, msg) : assert.notEqual(act, exp, msg)),
	pass : (msg)=>assert.ok(true, msg),
	timeout : (resolve, time)=>setTimeout(()=>resolve(new Error('Async timeout')), time)
});

module.exports = Assert;