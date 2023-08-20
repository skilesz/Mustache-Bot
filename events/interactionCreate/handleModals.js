const { InteractionType } = require('discord.js');

module.exports = async (client, interaction) => {
  if (interaction.type != InteractionType.ModalSubmit) return;

  const { modals } = client;
  const { customId } = interaction;

  if (!modals) return;
  
  const modal = modals.get(customId);

  if (!modal) {
    await interaction.reply({
      content: 'Sorry, this modal has not yet been set up. Please contact shadowstorm77 for more information.',
      ephemeral: true
    });
    return;
  }

  try {
    await modal.execute(client, interaction);
  } catch (err) {
    console.log(`ERROR (handleModals.js): ${err}`);
  }
};