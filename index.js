const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Client, Collection } = require('discord.js');
const client = new Client({ 
  intents: [
		1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
	]
});
const discordModals = require('discord-modals');
discordModals(client);
client._cmd = new Collection();
client.__use = (modal, inter, channelId, msgId) => {
  if (!inter.isButton()) return;
  if (inter.customId == "ver") {
    modal.user.send(`:white_check_mark: Abone rol isteğin onaylandı.\nOnaylayan: **${inter.user.tag}**`);
    modal.member.roles.add('abone-rol-id');
    modal.guild.channels.cache.get(channelId).messages.edit(msgId, {
      components: [{type: 1, components: [{type:"BUTTON",style:"SECONDARY",disabled:true,label: " ", custom_id: "lbl1"},{type:"BUTTON",style:"SECONDARY",disabled:true,label: " ", custom_id: "lbl3"}]}],
      content: ":white_check_mark: Rol başarıyla verildi!"
    });
  } else if (inter.customId == "verme") {
    inter.reply({
      content: "Neden iptal edilsin onu yazmalısın!",
      ephemeral: true
    });
    const filter2 = mesaj => mesaj.author.id !== client.user.id;
    const collector2 = inter.channel.createMessageCollector({ filter2 });
    collector2.on('collect', async (msh) => {
    if (msh.author.id !== inter.user.id) return;
      modal.guild.channels.cache.get(channelId).messages.edit(msgId, {
        components: [{type: 1, components: [{type:"BUTTON",style:"SECONDARY",disabled:true,label: " ", custom_id: "lbl2"},{type:"BUTTON",style:"SECONDARY",disabled:true,label: " ", custom_id: "lbl4"}]}],
        content: ":white_check_mark: İşlem başarıyla iptal edildi!"
      });
      modal.user.send(`:x: Abone rol isteğin iptal edildi.\nİptal eden: **${msh.author.tag}**\nİptal sebebi: **${msh.content}**`);
      collector2.stop("İptal!");
    });
  }
};

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const clientId = '945702550299111484';
const guildId = '946415178327687179';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push({
		name: command.name,
		description: command.description,
		options: command.options || [],
		type: 1
	});
	client._cmd.set(command.name, command)
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

(async () => {
	try {
		console.log('[SUMMER-DEVS] Komutlar yükleniyor.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('[SUMMER-DEVS] Komutlar yüklendi.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', (interaction) => {
  const cmd = client._cmd.get(interaction.commandName);
  try {
    cmd.exe(client, interaction);
  } catch (e) {
    return;
  }
});

client.on('modalSubmit', async (modal) => {
  if(modal.customId === 'abone-menu') {
    const firstResponse = modal.getTextInputValue('abone-ss-link'); //elleme
    modal.reply({
      content: `:tada: Girmiş olduğun bilgiler gönderildi, yetkililer ilgilencektir, sakın yetkililere etiket atma!`,
      ephemeral: true
    });
    const channel = modal.guild.channels.cache.get('log-kanal-id');
    const msz = await channel.send({
      content: "Abone rolü vermek/vermemek için butonlardan birine bas!",
      files: [firstResponse],
      components: [
        { 
          type: 1, 
          components: [
            {
              type: "BUTTON",
              custom_id: "ver",
              label: "Rol ver!",
              style: "PRIMARY",
              emoji: "🎉"
            },
            {
              type: "BUTTON",
              custom_id: "verme",
              label: "Rol verme!",
              style: "PRIMARY",
              emoji: "🎉"
            }
          ]
        }
      ]
    });
    client.on('interactionCreate', async (inter) => client.__use(modal, inter, channel.id, msz.id));
  }  
});

client.login("token");