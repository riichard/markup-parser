var fs = require('fs');
var cli = require('cli');
var util = require('util');
var htmlparser = require('htmlparser');
var rfr = require('rfr');
var parser = {
    toMarkup: rfr('src/toMarkup'),
    toHtml: rfr('src/toHtml'),
    diff: rfr('src/diff'),
    parseHtml: rfr('src/parseHtml'),
    parseMarkup: rfr('src/parseMarkup')
};

var options = cli.parse({
    toHtml: ['m', 'Markup file to convert to HTML', 'file', false],
    fromHtml: ['html', 'HTML file to convert to Markup', 'file', false],
    diff: ['d', 'diff file to apply to parsed content, use together with --outputHtml', 'file', false],
    outputHtml: ['html', 'HTML file to convert to Markup with diff', 'file', false],
});

if(options.fromHtml) {
    fs.readFile(options.fromHtml,'utf8', function(err, data) {
        if(err) {
            return console.log(err);
        }
        var dom = parser.parseHtml(data);
        var markup = parser.toMarkup(dom);
        console.log(markup);
    });
}

if(options.toHtml) {
    fs.readFile(options.toHtml,'utf8', function(err, data) {
        if(err) {
            return console.log(err);
        }
        var dom = parser.parseMarkup.parseMarkup(data);
        //console.log(util.inspect(dom, false, null));
        var html = parser.toHtml(dom);
        console.log(html);
    });
}

if(options.diff) {
    fs.readFile(options.outputHtml,'utf8', function(err, data) {
        if(err) {
            return console.log(err);
        }
        var dom = parser.parseHtml(data);
        parser.diff.applyDiff('TODO create diff and asynchronous file readout', dom);

        var html = parser.toHtml(dom);
        console.log(html);
    });


}
