

const Assert = {



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