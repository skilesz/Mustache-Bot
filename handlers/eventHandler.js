const getAllFiles = require('../utils/getAllFiles.js');
const path = require('path');

module.exports = (client) => {
  // Get all event folders
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  // For each event folder, get all event files, and set a listener for each event that runs its corresponding function when the event is detected
  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    const eventName = eventFolder.split('/').pop();

    eventFiles.sort((a, b) => a > b);

    // Event listener
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }
};