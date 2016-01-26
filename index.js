'use strict';
var co = require('co');
var conext = require('conext');
var coBody = require('co-body');
var typer = require('media-typer');

function getParser(type) {
    var parse = type ? coBody[type] : coBody;
    return conext(function *(req, res, next) {
        if (req._body) {
            return next();
        }
        req._body = true;
        var contentType = req.headers['content-type'];
        var charset = typer.parse(contentType).parameters.charset;
        req.body = yield parse(req, {
            encoding: charset
        });
        next();
    });
}

exports = module.exports = getParser();
exports.json = getParser('json');
exports.form = getParser('form');
exports.text = getParser('text');
