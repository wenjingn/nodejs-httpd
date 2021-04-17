let cfg = {
	root : 'G:\\node-proj',
	proxy : {
	    '/index.php':{
	        target: 'http://bbcash-api',
	    },
	    '/api':{
	        target: 'http://sxyg.broadblue.net',
	    }
	}
}

module.exports = cfg