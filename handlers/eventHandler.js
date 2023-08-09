const getAllFiles = require('../utils/getAllFiles.js');
const path = require('path');

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  console.log(eventFolders);
};