const ErrorReport = require('../reporters/error.js');
const assert = require('assert');


ErrorReport(new Error('This is an error'), "This is the message for the error");


try{
	assert.equal([1,2], [2,1], "Let's go");
}catch(err){
	ErrorReport(err, "This is an assertion error");
}
