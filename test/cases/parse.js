'use strict';
var http = require('http');
var dsBody = require('../../');
var iconv = require('iconv-lite');
var tape = require('tape');
var app = require('express')();
var concat = require('concat-stream');

app.post('/any', dsBody, echo);
app.post('/text', dsBody.text, echo);
app.post('/form', dsBody.form, echo);
function echo(req, res, next) {
    res.end(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
};

app.listen(function () {
    var server = this;
    var address = server.address();
    function post(url, data, headers, callback) {
        headers['Contenet-Length'] = data.length;
        var opts = {
            hostname: '127.0.0.1',
            port: address.port,
            path: url,
            method: 'POST',
            headers: headers
        };
        var req = http.request(opts, function (res) {
            res.pipe(concat(callback));
        });
        req.write(data);
        req.end();
    }
    tape('post text/plain, parsed by any', function (test) {
        test.plan(1);
        post('/any', 'test', {'Content-Type': 'text/plain'}, function (buf) {
            test.strictEqual(buf.toString('utf8'), 'test');
        });
    })
    tape('post gbk json, parsed by any', function (test) {
        test.plan(1);
        post('/any', iconv.encode('{"你好":"世界"}', 'gbk'), {'Content-Type': 'application/json; charset=gbk'}, function (buf) {
            var str = buf.toString('utf8');
            test.deepEqual(JSON.parse(str), {"你好":"世界"});
        });
    })
    tape('post gbk form, parsed by form', function (test) {
        test.plan(1);
        post('/form', iconv.encode('你好=世界', 'gbk'), {'Content-Type': 'application/x-www-form-urlencoded; charset=gbk'}, function (buf) {
            var str = buf.toString('utf8');
            test.deepEqual(JSON.parse(str), {"你好":"世界"});
        });
    })
    tape('post gbk form, parsed by text', function (test) {
        test.plan(1);
        post('/text', iconv.encode('你好=世界', 'gbk'), {'Content-Type': 'application/json; charset=gbk'}, function (buf) {
            var str = buf.toString('utf8');
            test.strictEqual(str, '你好=世界');
        });
    })
    tape('test description', function (test) {
        test.plan(1);
        server.close(function () {
            test.ok(true);
        });
    })
});

