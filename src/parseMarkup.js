var util = require('util');
var winston = require('winston');

// Parse markup
//
//

// - split lines into separate rawnodes
// - split into sections by heading
// - convert rawnodes to data nodes
// - some nodes will have children in the next nodes. Each time we parse a node, we check which
// next nodes are children nodes, lists can be recursive. So add functionality
// to that later. Step by step.


var testNodeTypes = {
    heading: /^[\=]+\s?([^\=]+)\s?[\=]+?$/,
    whiteline: /^$|^\s+$/,
    list: /([\*\-]+\s+|[0-9A-Za-z\.]+\.\s+)/
};


// Input: text with whitelines
// Returns: array of text, split by whiteline
// Example:
// in:
//      == fix a bug ==
//      * Understand bug
//      * Write code
//
// out:
// [
//      '== fix a bug ==',
//      '* Understand bug',
//      '* Write code',
//      ''
// ]
function textToLines(text) {
    return text.split(/\r?\n/);
}

// Input: Raw text nodes
// Output: Data node
// Example:
// in: [
//      '== Fix a bug ==',
//      '* Understand bug',
//      '* Write code',
//      ''
//      '== Another thing',
//      '* Understand bug',
//      '* Write code',
//      ''
// ]
// out: [
//      {
//          type: 'tag',
//          name: 'section',
//          children: [
//            {
//                type: 'tag',
//                data: 'Fix a bug',
//                name: 'h2'
//                children: [
//                    {
//                        type: 'tag',
//                        name: 'ol',
//                        children: [
//                            {
//                                type: 'tag',
//                                name: 'li',
//                                children: [
//                                    {
//                                        type: 'text',
//                                        data: 'Understand bug'
//                                    }
//                                    ...
//                                ]
//                            }
//                            ...
//                        ]
//                    }
//                    ...
//                ]
//            }
//       ]
//  }
//  ...
//  ]

// Returns array of arrays of nodes
// [
//      [
//          '== Fix a bug',
//          '* understand bug'
//      ],
//      [
//          '== something else',
//          '* understand bug'
//      ]
// ], $concatinatorType
function toNodesOfSiblings(nodes) {
    var out = [];
    for(var i=0; i < nodes.length; ) {
        var type = lineToType(nodes[i]);
        var indexToNextSibling = indexToNodeByTypes(nodes, [type], i+1);
        winston.debug(type, indexToNextSibling, nodes[i]);

        if(indexToNextSibling === -1) {
            indexToNextSibling = nodes.length;
        }

        out.push(nodes.slice(i, indexToNextSibling));
        i = indexToNextSibling;
    }
    return out;
}

// Returns the index-of the item in nodes to one of the types in typesTo.
// Returns -1 if the type can't be found.
// in:
// [
//      '== fix a bug ==',
//      '* Understand bug',
//      '* Write code',
//      '',
//      '== another thing'
// ], ['heading', 'whitespace']
// out: 3
function indexToNodeByTypes(nodes, typesTo, offset) {
    for(var i = offset || 0; i < nodes.length; i++) {
        var type = lineToType(nodes[i]);
        if(typesTo.indexOf(type) !== -1) {
            return i;
        }
    }
    return -1;
}

// Returns type of node
// in:
// == fix a bug ==
// out:
// 'heading'
function lineToType(node) {
    var types = Object.keys(testNodeTypes);
    for(var i=0; i<types.length; i++) {
        var type = types[i];
        var typePattern = testNodeTypes[type];
        if(typePattern.test(node)) {
            return type;
        }
    }
    return 'other';
}

function nodeToText(line){
    // Strip markup from raw node
    return line;
}

// Input: text
// Output: Data nodes
// Example:
// in:
// TODO
function parseMarkup(text) {
    var lines = textToLines(text);
    //console.log(toNodesOfSiblings(lines));
    return linesToNodes(lines);
}

function linesToNodes(lines) {
    var nodes = [];
    winston.debug(lines);
    for(var indexToNextLine = 0; indexToNextLine < lines.length; ){
        var line = lines[indexToNextLine];
        var type = lineToType(line);
        var currentIndex = indexToNextLine;
        winston.debug('parsing node', currentIndex, line);

        if(type === 'heading') {
            // Set index for next heading. All nodes in this section will be added
            // to the section tag
            var indexToNextHeading = indexToNodeByTypes(lines, ['heading'], indexToNextLine + 1 );
            winston.debug('index to next heading', indexToNextHeading);

            // If heading can't be found. Finish the loop
            if(indexToNextHeading === -1) {
                indexToNextLine = lines.length;
            }
            else {
                indexToNextLine = indexToNextHeading;
            }

            var linesToNextSection = lines.slice(currentIndex + 1, indexToNextLine);
            winston.debug('linesToNextSection', linesToNextSection);

            winston.debug('indexToNextLine', indexToNextLine);
            var node = {
                type: 'tag',
                name: 'section',
                children: [
                    {
                        type: 'tag',
                        name: 'h2',
                        children: [{
                            type: 'text',
                            data: nodeToText(line)
                        }]
                    }
                ].concat(linesToNodes(linesToNextSection))
            };
        }
        else if(type === 'list') {
            indexToNextLine = lines.length;
            var node = {
                type: 'tag',
                name: 'ul',
                children: lines
                    .filter(line => !/(^$|^\s$)$/.test(line)) // Remove whitelines
                    .map(function(line) {
                        return {
                            type: 'tag',
                            name: 'li',
                            children: [{
                                type: 'text',
                                data: nodeToText(line)
                            }]
                        }
                    })
            };
        }
        else { // TODO ignore line?
            indexToNextLine++;
        }
        nodes.push(node);
    }
    winston.debug(util.inspect(nodes, false, null));
    return nodes;
}


module.exports = parseMarkup;
