module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const { buttons } = client;
  const { customId } = interaction;
  
  if (!buttons) return;
  
  const button = buttons.get(customId);

  // Check if button has been setup yet
  if (!button) {
    await interaction.reply({
      content: 'Sorry, this button has not yet been set up. Please contact shadowstorm77 for more information.',
      ephemeral: true
    });
    return;
  }

  // Execute button
  try {
    await button.execute(client, interaction);
  } catch (err) {
    console.log(`ERROR (handleButtons.js): ${err}`);
  }
};