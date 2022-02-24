const { Modal, TextInputComponent, showModal } = require('discord-modals')

module.exports = {
  name: "abone",
  description: "abone",
  options: [],
  async exe(client, interaction) {
    const member = (rol) => interaction.member.roles.cache.has(rol);
    if (member("abone-rol-id")) {
      return interaction.reply({
        content: ":x: Sen zaten abone olmuşsun!",
        ephemeral: true
      });
    } else {
      const modal = new Modal()
      .setCustomId('abone-menu')
      .setTitle('Abone Rol Menüsü')
      .addComponents(
        new TextInputComponent()
        .setCustomId('abone-ss-link')
        .setLabel('Ekran görüntüsü linki girin.')
        .setStyle('SHORT')
        .setMinLength(2)
        .setMaxLength(100)
        .setPlaceholder('https://cdn.discordapp.com/attachments/...')
        .setRequired(true),
      );
      showModal(modal, { client, interaction });
    }
  }
}