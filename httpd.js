let http = require('http')
let fs   = require('fs')
let cfg  = require('./conf')

let app = http.createServer(function(request, response){
    let url = request.url
    if(url !== '/favicon.ico') {
        for (var key in cfg.proxy) {
            if (url.indexOf(key) > -1) {
                let info = cfg.proxy[key].target.split(':')
                let opt = {
                    protocol: info[0]+':',
                    host:     info[1].slice(2),
                    port:     info[2] || 80,
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