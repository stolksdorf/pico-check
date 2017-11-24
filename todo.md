/* FIXME:
- Don't expose raw functions, just do call objects for now
- Have the files call an instance of a group, to get the scope right
- have a run function on a group that runs all sub tests and groups
- run function takes an event reporter, passes it down to emit out test events
- maybe an opts call passed down to

- Two major types: Group and Assertion

*/

/* Shower Notes
- Ditch plan, async tests must return a promise
- look int promise.race for making a timed promise util
- todo, skip, etc. should be functions. Simplifies the inheritance a ton
- the assertion runner should return a simple promise, in the test handler it has access to the test event mitter
- The assertion runner stops as soon as it has a failaure
-


/*
- Test cases shouldn't have access to the reporter
- Test Cases simply return promises



*/




// const getTimedReject = (time=500)=>{
// 	return new Promise((resolve,reject)=>{
// 		setTimeout(()=>{
// 			reject('Async test timed out')
// 		}, time)
// 	});
// };

//let currentID = 0;