const { readdirSync } = require('fs');

module.exports = (client) => {
  // Handle all components
  client.handleComponents = async () => {
    // Get all component folders
    const componentFolders = readdirSync('./src/components');

    // For each component folder, get all component files, then set the relevant components
    for (const folder of componentFolders) {
      // Get all component files
      const componentFiles = readdirSync('./src/components/' + folder).filter(
        (file) => file.endsWith('.js');
      );

      const { buttons } = client;
      
      switch (folder) {
        case 'buttons': // Get each button and set it in the client
          for (const file of componentFiles) {
            const button = require('../../components/' + folder + '/' + file);
            buttons.set(button.data.name, button);
          }
          break;
        default:
          break;
      }
    }
  };
};