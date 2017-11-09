

const Assert = {
	createTimeout : (cb, time=500)=>{
		setTimeout(()=>{
			cb(new Error('Async test timed out'));
		}, time)
	},


	create : ()=>{
		return {
			pass : (msg)=>{},
			fail : (msg='Assertion failed')=>{ throw new Error(msg); },
			is   : (actual, expected, msg)=>{
				if(actual !== expected){
					//TODO: add meta
					throw new Error(msg)
				}
			}
		}
	},

}


module.exports = Assert;