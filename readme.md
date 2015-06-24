# cc-body - 可以接受 GBK 编码的 body parser

最近遇到 body-parser 有问题的情况比较多（可能我们的用法在它升级后导致一些错误），另外也一直有不能正确处理 GBK 编码的问题，而友商汇付发过来的消息可能是 GBK 的，所以写了这个小 module，具体看 http://www.zhihu.com/question/28737058

实际上相当于一个自动判断 charset 的 body-parser

## install
```js
npm i --save cc-body
```

## usage
```js
var parse = require('cc-body');
app.post('/any', parse, function (req, res, next) { /* ... */ });
app.post('/json', parse.json, function (req, res, next) { /* ... */ });
app.post('/text', parse.text, function (req, res, next) { /* ... */ });
app.post('/form', parse.form, function (req, res, next) { /* ... */ });
```

## license
MIT
