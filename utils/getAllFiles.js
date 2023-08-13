const fs = require('fs');
const path = require('path');

module.exports = (directory, foldersOnly = false) => {
  var fileNames = [];

  // Get files
  const files = fs.readdirSync(directory, { withFileTypes: true });

  // For each file, push file path to array
  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  // Return array of file paths
  return fileNames;
};