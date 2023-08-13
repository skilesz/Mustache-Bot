const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  var localCommands = [];

  // Get command categories
  const commandCategories = getAllFiles(
    path.join(__dirname, '..', 'commands'),
    true,
  );

  // For each command category, push local command onto array
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      localCommands.push(commandObject);
    }
  }

  // Return array of local commands
  return localCommands;
};