
var htmlparser = require('htmlparser');


// In: HTML
// Out: err, Data structure
// TODO add parsing stream compatibility
function parseHtml(html, callback) {
    var handler = new htmlparser.DefaultHandler(function(error, dom) {
        if(error) {
            return console.error(error);
        }
    });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    return cleanNodes(handler.dom);
}

function cleanNodes(nodes) {
    return nodes.map(node => {
        if(node.attribs && node.attribs.line) {
            node.attribs.line = parseInt(node.attribs.line)
        }
        if(node.data) {
            node.data = node.data.replace(/^\s+|\s+$/g, '');
        }
        if(node.children) {
            node.children = cleanNodes(node.children);
        }
        return node;
    });
    return nodes;
}


module.exports = parseHtml;
