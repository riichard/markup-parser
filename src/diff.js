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

    //var mergingDom = parseMarkup([
        //'* learn a new language',
        //'',
        //'== steps to world peace ==',
        //'* make finding and sharing information easy accessible',
        //'* inspire curiosity to keep on learning',
        //'* discover that listening is the only way forward'
    //]);
    //mergeAtIndex(3, mergingDom);
}

function replaceNodeText(dom, index, newText) {
    var node = findNode(dom, index);
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
    var node = findNode(dom, index);
    node.siblings.splice(node.indexToParent, 0, newNode);
}

//function mergeDom(dom, index, newDom) {
//}

// In: Dom
// In: Index
// Returns object (reference)
// returns -1 if node can't be found
function findNode(dom, index) {
    for(var i=0;i<dom.length;i++){
        var node = dom[i];

        // Setting data for book-keeping
        if(!node.siblings) node.siblings = dom;
        if(!node.indexToParent) node.indexToParent = i;

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
