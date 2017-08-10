// TODO
//
//
// - data structure parsed content
// - CLI arguments parsing, something with process.ENV
//
//
// data format
// - adaptable for nested items
// - multiple blocks / sections
// - adaptable for other pieces of markup, maybe consist with the nodes
// structure of HTML how it includes bold/text nodes
// - ability to pull diffs, With a difficult object structure, it might be hard to
// compare nodes with nodejs, but I can use JSON.stringify and maybe find
// another library to compare them
//
//
// [
//      ['section',
//          ['heading', 'Fix a bug' ]
//          ['list',
//              ['listItem', [
//                  ['text', 'Verify fix in beta cluster']
//              ],
//              ['listItem', [
//                  ['text', 'Verify fix in beta cluster']
//              ]
//              ['listItem', [
//                  ['text', 'Something more']
//              ]
//          ],
//      ],
//      ['section', [
//          ['heading', 'WIP: QA' ]
//          ['list', [
//              ['listItem', [
//                  ['text', 'Verify fix in beta cluster']
//              ],
//              ['listItem', [
//                  ['text', 'Verify fix in beta cluster']
//              ]
//              ['listItem', [
//                  ['text', 'Something more']
//              ]
//          ],
//      ]]
// ]
//
//



