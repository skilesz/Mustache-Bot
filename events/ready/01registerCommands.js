const { testServer } = require('../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');

module.exports = async (client, arg) => {
  try {
    // Get local and application commands
    const localCommands = getLocalCommands();
    const applicationCommandManager = await getApplicationCommands(client, testServer);
    const applicationCommandArray = Array.from(await applicationCommandManager.fetch());
    const applicationCommands = await applicationCommandArray.map((cmd) => cmd[1]);

    // For each application command, check if existing local command. If not, delete command
    for (const applicationCommand of applicationCommands) {
      const { name } = applicationCommand;

      if (!localCommands) continue;
      
      const existingCommand = localCommands.find((cmd) => cmd.name === name);

      if (!existingCommand) {
        await applicationCommand.delete();
        console.log(`/${name} command deleted`);
      }
    }
    
    // For each local command, check if existing application command. If so, check if commands are different. If so, edit command. If not existing application command, register command
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await existingCommand.edit({
            description,
            options,
          });

          console.log(`/${name} command edited`);
        }
      } else {
        await applicationCommandManager.create({
          name,
          description,
          options
        });

        console.log(`/${name} command registered`);
      }
    }
  } catch (err) {
    console.log('ERROR (01registerCommands.js): ' + err);
  }
};