const { readdirSync } = require('fs');

module.exports = (client) => {
  // Get all component folders
  const componentFolders = readdirSync('./components');

  // For each component folder, get all component files, then set the relevant components
  for (const folder of componentFolders) {
    // Get all component files
    const componentFiles = readdirSync('./components/' + folder).filter(
      (file) => file.endsWith('.js')
    );

    const { buttons, modals, selectMenus } = client;
      
    switch (folder) {       
      case 'buttons': // Get each button and set it in the client
        for (const file of componentFiles) {
          const button = require('../components/' + folder + '/' + file);
          buttons.set(button.data.name, button);
          console.log(`Registered ${button.data.name} button`);
        }
        break;
      case 'modals':
        for (const file of componentFiles) {
          const modal = require(`../components/${folder}/${file}`);
          modals.set(modal.data.name, modal);
          console.log(`Registered ${modal.data.name} modal`);
        }
        break;
      case 'selectMenus':
        for (const file of componentFiles) {
          const menu = require(`../components/${folder}/${file}`);
          selectMenus.set(menu.data.name, menu);
          console.log(`Registered ${menu.data.name} select menu`);
        }
      default:
        break;
    }
  }
};