var util = require('util');
var winston = require('winston');

// Parse markup
//
// - Parse text to lines
// - Detect blocks of lines, and either put them in a <section> or <ul> or
// something else in the future, if not defined, put in a <p>
//      - Detecting blocks go by checking the first line, and forming a block
//      of all lines that aren't different than the type of the first line
// - Maintain line numbers of parsed markup in the attributes


var testLineTypes = {
    heading: /^[\=]+\s?([^\=]+)\s?[\=]+?$/,
    whiteline: /^$|^\s+$/,
    list: /^([\*\-]+\s+|[0-9A-Za-z\.]+\.\s+)/

    // Code for conceptual other parser
    //h1: /^[\=]{1}\s?([^\=]+)\s?[\=]{1}?$/,
    //h2: /^[\=]{2}\s?([^\=]+)\s?[\=]{2}?$/,
    //h3: /^[\=]{3}\s?([^\=]+)\s?[\=]{3}?$/,
    //liO: /^[0-9A-Za-z\.]+\.\s+/,
    //liU1: /^[\*\-]{1}\s+/,
    //liU2: /^[\*\-]{2}\s+/,
    //liU3: /^[\*\-]{3}\s+/
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
function indexOfByTypes(nodes, typesTo, offset) {
    for(var i = offset || 0; i < nodes.length; i++) {
        var type = lineToType(nodes[i]);
        if(typesTo.indexOf(type) !== -1) {
            return i;
        }
    }
    return -1;
}

// Returns type of line
// in:
// == fix a bug ==
// out:
// 'heading'
function lineToType(line) {
    var types = Object.keys(testLineTypes);
    for(var i=0; i<types.length; i++) {
        var type = types[i];
        var typePattern = testLineTypes[type];
        if(typePattern.test(line)) {
            return type;
        }
    }
    return 'other';
}

// Strip markup from a line
// In:
// == fix a bug ==
// out:
// 'fix a bug'
function nodeToText(line){
    var type = lineToType(line);
    switch(type){
        case 'heading':
            return line.replace(/^[\=]+\s?([^\=]+)\s?[\=]+?$/, '$1');
        case 'list':
            return line.replace(/^([\*\-]+\s+|[0-9A-Za-z\.]+\.\s+)/, '');
        default:
            return line;
    }
}

function parseMarkup(text) {
    var lines = textToLines(text);

    // TODO code for testing conceptual parser
    //console.log(toArrayOfSiblings(lines));
    //console.log(toArrayOfSiblings(['* D', '* E', '* F', '' ]));

    return linesToNodes(lines);
}

// Input: array of lines
// Output: Data node
// lineOffset can be used to make the attributed line number start at a
// different number
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
function linesToNodes(lines, lineOffset) {
    lineOffset = lineOffset || 0;

    var nodes = [];
    winston.debug(lines);
    for(var indexToNextLine = 0; indexToNextLine < lines.length; ){
        var line = lines[indexToNextLine];
        var type = lineToType(line);
        var currentIndex = indexToNextLine;
        var currentLineIndex = lineOffset + currentIndex;
        winston.debug('parsing node', currentIndex, line);

        if(type === 'heading') {
            // Set index for next heading. All nodes in this section will be added
            // to the section tag
            var indexToNextHeading = indexOfByTypes(lines, ['heading'], indexToNextLine + 1 );
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
                        attributes: {
                            line: (currentLineIndex++)
                        },
                        children: [{
                            type: 'text',
                            data: nodeToText(line)
                        }]
                    }
                ].concat(linesToNodes(linesToNextSection, currentLineIndex))
            };
        }
        else if(type === 'list') {
            indexToNextLine = lines.length;
            var node = {
                type: 'tag',
                name: 'ul',
                children: lines
                    .filter(line => !/(^$|^\s$)$/.test(line)) // Remove whitelines
                    .map(function(line, listIndex) {
                        return {
                            type: 'tag',
                            name: 'li',
                            attributes: {
                                line: (currentLineIndex++)
                            },
                            children: [{
                                type: 'text',
                                data: nodeToText(line)
                            }]
                        }
                    })
            };
        }
        else {
            var node = {
                type: 'tag',
                name: 'p',
                attributes: {
                    line: currentLineIndex
                },
                children: [{
                    type: 'text',
                    data: line
                }]
            };
            indexToNextLine++;

        }
        nodes.push(node);
    }
    winston.debug(util.inspect(nodes, false, null));
    return nodes;
}

/* This is conceptual code. I think it'd be more versatile than the complex if
 * statement loop. But requires more editing/work*/
// Returns [$concatinatorType, array of arrays of nodes]
// [
//      h2,
//       [
//            [
//                '== Fix a bug',
//                '* understand bug'
//            ],
//            [
//                '== something else',
//                '* understand bug'
//            ]
//       ]
// ]
function toArrayOfSiblings(nodes) {
    var out = [];

    // TODO Don't know if this is possible yet. Just in case
    if(nodes.length === 0) {
        return [ '', []];
    }

    var type = lineToType(nodes[0]);
    for(var i=0; i < nodes.length; ) {

        var indexToNextSibling = indexOfByTypes(nodes, [type], i+1);
        winston.debug(type, indexToNextSibling, nodes[i]);

        if(indexToNextSibling === -1) {
            indexToNextSibling = nodes.length;
        }

        out.push(nodes.slice(i, indexToNextSibling));
        i = indexToNextSibling;
    }
    return [type, out];
}

function arrayOfSiblingsToNodes(arrayOfSiblings) {
}
/* end of conceptual code */


module.exports = {
    linesToNodes,
    parseMarkup,
};
