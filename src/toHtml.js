var util = require('util');

function toHtml(nodes, indentSize) {
    if(!nodes || nodes.length === 0) return '';

    indentSize = indentSize || 0;
    var indent = createIndent(indentSize);

    return (nodes.map(node => {
        if(node.type === 'text') {
            return indent + node.data;
        }
        if(node.type === 'tag') {
            return indent + '<'
                + node.name
                + attributesToString(node.attributes)
                + '>\n'
                + toHtml(node.children, indentSize + 1)
                + '\n'
                + indent
                + '</'
                + node.name
                + '>';
        }
        // TODO add support for comment nodes or such
    }).join('\n'));
}

function attributesToString(attributes) {
    var out = '';
    if(!attributes) return out;

    var keys = Object.keys(attributes);
    var key;

    for(var i=0;i<keys.length;i++) {
        key = keys[i];
        out += ' '
            + key
            + '="'
            + attributes[key].replace('"', '\\"')
            + '"';
    }
    return out;
}

function createIndent(indentSize) {
    var indent = '';
    for(var i = 0; i < indentSize; i++) {
        indent += '  ';
    }
    return indent;
}



module.exports = toHtml;
