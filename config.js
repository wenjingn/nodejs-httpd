let cfg = {
	root : 'G:\\node-proj\\0digit-test',
	proxy : {
	    '/api':{
	        target: 'http://0dcash-api.dev.0digit.net',
	        pathRewrite: {
	        	"^/api/" : "/"
	        }
	    }
	}
}

module.exports = cfg