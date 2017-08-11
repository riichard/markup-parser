var util = require('util');

// In: diff in ed-format
// In: dom object
// Edits the dom object by reference, does not return it
function applyDiff(diff, nodes) {
    // TODO create parser for diff markup. First step is having the features to
    // edit the dom
    //console.log(util.inspect(nodes, false, null));
    replaceNodeText(nodes, 3, 'Hallo Wereld');
    //console.log(util.inspect(nodes, false, null));
}

function replaceNodeText(dom, index, newText) {
    var node = findNode(dom, index);
    console.log('node', index, node);

}

// In: Dom
// In: Index
// Returns object (reference)
// returns -1 if node can't be found
function findNode(dom, index) {
    for(var i=0;i<dom.length;i++){
        var node = dom[i];
        var currentIndex = node.attribs ? node.attribs.line : -1;

        if(currentIndex === index) {
            return node;
        }

        //if(i === dom.length -1) {
            //console.log('node is last sibling');
            //var nextSiblingIndex = Infinity;
        //}
        //else {
            //var nextSibling = dom[i + 1];
            //var nextSiblingIndex = nextSibling.attribs ? parseInt(nextSibling.attribs.line) : -1;
            //console.log('next sibling:', nextSiblingIndex, nextSibling);
        //}

        // Look in this node's children if the next sibling has a greater index
        //if(index < nextSiblingIndex) {
            //console.log('node is before next index');
            //console.log(node);
            //if(!node.children) return -1;
            //return findNode(node.children, index);
        //}

        if(node.children) {
            var nodeInChildren = findNode(node.children, index);
            if(nodeInChildren !== -1) {
                return nodeInChildren;
            }
        }
    }
    return -1;
}


module.exports = {
    applyDiff,
};
