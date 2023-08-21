module.exports = async (client, interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const { selectMenus } = client;
  const { customId } = interaction;
  
  if (!selectMenus) return;
  
  const menu = selectMenus.get(customId);

  // Check if button has been setup yet
  if (!menu) {
    await interaction.reply({
      content: 'Sorry, this menu has not yet been set up. Please contact shadowstorm77 for more information.',
      ephemeral: true
    });
    return;
  }

  // Execute button
  try {
    await menu.execute(client, interaction);
  } catch (err) {
    console.log(`ERROR (handleMenus.js): ${err}`);
  }
};