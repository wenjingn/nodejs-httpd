let cfg = {
	root : 'G:\\node-proj',
	proxy : {
	    '/api':{
	        target: 'http://bbcash-api',
	    }
	}
}

module.exports = cfg