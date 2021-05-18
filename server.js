let http = require('http')
let fs   = require('fs')
let cfg  = require('./config')

let app = http.createServer(function(request, response){
    let url = request.url
    if(url !== '/favicon.ico') {
        for (var key in cfg.proxy) {
            if (url.indexOf(key) > -1) {
                var rule = cfg.proxy[key]
                let info = rule.target.split(':')
                let host = info[1].slice(2)
                let port = info[2] || 80
                request.headers.host = host + ':' + port
                for (var pattern in rule.pathRewrite) {
                    var reg = new RegExp(pattern)
                    if (reg.test(url)) {
                        url = url.replace(reg, rule.pathRewrite[pattern])
                        break
                    }
                }
                let opt = {
                    protocol: info[0]+':',
                    host:     host,
                    port:     port,
                    method:   request.method,
                    path:     url,
                    json:     true,
                    headers:  request.headers
                }
                proxy(opt, request, response)
                return;
            }
        }

        fs.readFile(cfg.root + (url==='/' ? '/index.html' : url), function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
                response.end(data)
            }
        });
    }
}) 

function proxy(opt, request, response) {
    /* proxyRequest.end() 调用后才会发送请求 */
    var proxyRequest = http.request(opt, function(proxyResponse) {
        proxyResponse.on('data', function(chunk) {
            console.log(chunk.toString('utf-8'))
            response.write(chunk, 'binary');
        });

        proxyResponse.on('end', function() {
            response.end();
        });
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });
    
    request.on('data', function(chunk) {
        console.log('in request length:', chunk.length);
        proxyRequest.write(chunk, 'binary');
    });

    request.on('end', function() {
        proxyRequest.end();
    });
}


app.listen(8000)
console.log('server is listen on 8000....')