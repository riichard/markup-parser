# Markup Parser
Parses wiki style markup to HTML.

### Usage

##### Installing
```
npm install
```

##### Running
```
node main.js --toHtml yourMarkupDocument.markup
```

For other options, please use the `--help` function.
```
node main.js --help
```


### Todo

- [x] Commit current state
- [x] Check variable names and code comments
- [x] Add support for replacing single line's content
- [x] Add support for deleting nodes
- [x] Add support for adding nodes at a specific index
- [ ] Add support for adding a nodes-list to a dom. And detect which item
    should be put where (li in ul), (new section appended to below)
- [ ] Look into other parsing algorithms, that allow more complex grammars
- [-] Create readme
- [ ] Add unit tests
