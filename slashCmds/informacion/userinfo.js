const moment = require("moment");
moment.locale("es");

const fetch = require("node-fetch");

module.exports = {
  name: "userinfo",
  description: "Información de un usuario.",
  options: [{
    name: "usuario",
    description: "El usuario a ver su información.",
    type: 6
  }],
  async execute(client, interaction, embed) {
      await interaction.deferReply();
    
      const usuario = interaction.options.getUser("usuario") || interaction.user;
      let miembro = interaction.member.id === usuario.id ? interaction.member : interaction.options.getMember("usuario")
    
    	let variableInnecesaria = Object.values(usuario.flags.toArray()).join(" ").toString().replace('DISCORD_EMPLOYEE', "<:disployeer:877167680040341594>").replace('67680040341594>")
        .replace("PARTNERED_SERVER_OWNER', '<:parner:877167679813857360>').replace('HYPESQUAD_EVENTS', '<:hypesquad:849354131281149982>').replace('BUGHUNTER_LEVEL_1', '<:bh:849354132119748709>').replace('HOUSE_BRAVERY', '<:bravery:849354131012976651>').replace("HOUSE_BRILLIANCE", "<:brilliance:849354131373293618>").replace("HOUSE_BALANCE", "<:balance:849354131679477780>").replace("EARLY_SUPPORTER", "<:earlys:849354132074004510>").replace("TEAM_USER", "<:disployeer:877167680040341594>").replace(
			"BUGHUNTER_LEVEL_2", "<:bhg:849354132208353330>").replace(
			"EARLY_VERIFIED_BOT_DEVELOPER", "<:devv:849354131235668010>").replace(
			"VERIFIED_BOT", "<:vbot1:877167680115863582><:vbot2:877167679729958953>").replace(
			"DISCORD_CERTIFIED_MODERATOR", "<:mod:877167679851626548>")

		fetch(`https://discord.com/api/v9/users/${usuario.id}`, {
			method: 'GET',
			headers: {
				"Authorization": `Bot ${client.token}`
			}
		}).then((res) => res.json()).then(async (user) => {
      
				embed.setAuthor({name: usuario.tag, iconURL: usuario.displayAvatarURL({dynamic: true})})
				embed.setDescription(`**Creado el** ${moment(usuario.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss')[0].toUpperCase() + moment(usuario.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss').slice(1)} (${moment(usuario.createdAt).fromNow()})\n**ID:** ${usuario.id}`)
				embed.setColor(user.banner_color ? user.banner_color : embed.color)
				embed.addField('Insignias', variableInnecesaria || 'No tiene.', true)
				embed.addField('¿Es un bot?', usuario.bot ? 'Sí' : 'No', true)

			if (miembro) { 
        
        
				embed.setDescription(`**Entró al servidor el** ${moment(miembro.joinedAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss')[0].toUpperCase() + moment(miembro.joinedAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss').slice(1)} (${moment(miembro.joinedAt).fromNow()})\n**Creado el** ${moment(usuario.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss')[0].toUpperCase() + moment(usuario.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss').slice(1)} (${moment(usuario.createdAt).fromNow()})\n**ID** ${usuario.id}`)

				if(miembro.nickname) {
					embed.addField('Apodo', miembro.nickname, true)
				}


		let status;
if(miembro.presence !== null) {	
		switch (miembro.presence.status) {
			case "online":
				status = 'Conectado'
				break;
			case "idle":
				status = 'Ausente'
				break;
			case "dnd":
				status = 'No molestar'
				break;
			default:
				status = 'Desconectado'	
				break;
		}

}

				embed.addField('Estado', miembro.presence ? status : 'Desconectado', true)
				embed.addField('¿Booster?', miembro.premiumSince ? 'Sí.' : 'No.', true)
				embed.addField('Hex', miembro.displayHexColor || 'No tiene.', true)
				embed.addField('Roles', `Más alto: ${miembro.roles.highest}\nAlgunos: ${miembro.roles.cache.map(c => `<@&${c.id}>`).slice(0, 10).join(", ")}`)
			} 

			await interaction.followUp({
        embeds: [embed]
      })
		});

  },
  category: "infos"
}