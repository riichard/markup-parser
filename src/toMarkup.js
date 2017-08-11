

var formatting = {
    // Returns string of node
    section: () => ['', '\n'],
    h2: () => ['== ', ' ==\n'],

    // TODO ol - better support for numbered items. Perhaps move children
    // concatenation to each formatting function. These numbers will bug if a non-li
    // node is part of the list
    // TODO this system has a bug in case another element is in between the
    // UL/OL and LI tag
    li: (node, parent, i) => [(parent.name === 'ol' ? (i+1)+'.' : '*') + ' ', '\n'],

    // TODO ol/li: add support for nested items
    ol: () => ['','']

    // TODO add other formattings
};

function nodeToString(node, parent, index) {
    // No need for formatting on text nodes
    if(node.type === 'text') return node.data;

    // Convert children to string if existing
    var childrenString = node.children ? nodesToString(node.children, node) : '';

    // If we have formatting for this type of node, add it and return as if
    if(node.type === 'tag' && typeof formatting[node.name] !== 'undefined') {
        var markup = formatting[node.name](node, parent, index);

        return [markup[0], childrenString, markup[1]].join('');
    }

    return childrenString;
}

function nodesToString(nodes, parent) {
    // Leave the formatting to the formatting functions, whitespace nodes will
    // only disturb our formatting
    return removeEmptyTextNodes(nodes)

        // Convert array of nodes to array of strings
        .map((node, i) => nodeToString(node, parent, i))

        // Convert array of strings to string
        .join('');
}

// Returns array of nodes, without the text nodes that only include whitespace
function removeEmptyTextNodes(nodes) {
    return nodes.filter((node) => {
        if(node.type === 'text') {
            return !(/^\s+$/.test(node.data))
        }
        return true;
    });
}

module.exports = nodesToString;
