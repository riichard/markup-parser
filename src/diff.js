var util = require('util');

// In: diff in ed-format
// In: dom object
// Edits the dom object by reference, does not return it
function applyDiff(diff, nodes) {
    // TODO create parser for diff markup. First step is to have the features to
    // edit the dom incrementally.
    replaceNodeText(nodes, 3, 'Hallo Wereld');
    replaceNodeText(nodes, 0, 'Nieuwe titel');
    deleteNode(nodes, 2);
    addNodeAtIndex(nodes, 1, {
        type: 'tag',
        name: 'li',
        children: [
            { type: 'text', data: 'We know nothing' }
        ]
    });
}

function replaceNodeText(dom, index, newText) {
    var node = findNode(dom, index);
    console.log('node', index, node);

    // TODO This assumes that nodes can only have one text child.
    node.children = [{
        type: 'text',
        data: newText
    }];
}

// Deletes node with $index from the dom
function deleteNode(dom, index) {
    var node = findNode(dom, index);
    node.siblings.splice(node.indexToParent, 1);
}

// Adds node at $index
function addNodeAtIndex(dom, index, newNode) {
    console.log('adding nodes');
    var node = findNode(dom, index);
    console.log(node);
    node.siblings.splice(node.indexToParent, 0, newNode);
    console.log(util.inspect(dom, false, null));
}


// In: Dom
// In: Index
// Returns object (reference)
// returns -1 if node can't be found
function findNode(dom, index) {
    for(var i=0;i<dom.length;i++){
        var node = dom[i];

        // Setting data for book-keeping
        node.siblings = dom;
        node.indexToParent = i;

        var currentIndex = node.attribs ? node.attribs.line : -1;

        if(currentIndex === index) {
            return node;
        }

        if(node.children) {
            var nodeInChildren = findNode(node.children, index);
            if(nodeInChildren !== -1) {
                return nodeInChildren;
            }
        }
    }
    return -1;
}

// TODO if we have a feature that can generate and set the indexes on each
// node, we're not dependant on any other code changing our numberings. We can
// also keep that code clean of tracking indexes.


module.exports = {
    applyDiff,
};
