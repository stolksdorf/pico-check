const utils = require('../utils.js');


//console.log(utils.getCodeDiff(4, 5))

//console.log(utils.getCodeDiff({ a : 5, b : 5}, { a : 5, b : 5}))

console.log(utils.getCodeDiff({ a : 'Hello', b : 5}, { a : 'Hello World', b : ()=>{}}))

console.log(utils.getCodeDiff({ a : 5, b : 5}, { a : true, b : new Date()}))


console.log('-------------');


console.log(utils.cleanStackTrace(new Error().stack));

