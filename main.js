// TODO
//
//
// [x] data structure parsed content
// [x] CLI arguments parsing, something with process.ENV

var fs = require('fs');
var cli = require('cli');
var util = require('util');
var htmlparser = require('htmlparser');
var rfr = require('rfr');
var parser = {
    toMarkup: rfr('src/toMarkup'),
    toHtml: rfr('src/toHtml'),
    parseHtml: rfr('src/parseHtml'),
    parseMarkup: rfr('src/parseMarkup')
};

var options = cli.parse({
    toHtml: ['m', 'Markup file to convert to HTML', 'file', false],
    fromHtml: ['html', 'HTML file to convert to Markup', 'file', false]
});

if(options.fromHtml) {
    fs.readFile(options.fromHtml,'utf8', function(err, data) {
        if(err) {
            return console.log(err);
        }
        var data = parser.parseHtml(data);
        var markup = parser.toMarkup(data);
        console.log(markup);
    });
}

if(options.toHtml) {
    fs.readFile(options.toHtml,'utf8', function(err, data) {
        if(err) {
            return console.log(err);
        }
        var data = parser.parseMarkup.parseMarkup(data);
        var html = parser.toHtml(data);
        console.log(html);
    });
}

