const { decode } = require("imagescript"),
      fetch = require("node-fetch"),
      moment = require("moment");

moment.locale("es");

let { notif_level, exp_content_filter, mfa_level, verif_level, nsfw_level, premium_tier, guild_features } = require("../../utils/objetos.js")
module.exports = {
  name: "server",
  description: "Diversas cosas acerca del server.",
  options: [{
    name: "info",
    description: "Información general acerca del server.",
    type: 1
  }, {
    name: "icon",
    type: 1,
    description: "Devuelve el ícono del servidor."
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    
    const command = interaction.options.getSubcommand("server"),
          guild = interaction.guild,
          creada = moment(guild.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss')[0].toUpperCase() + moment(guild.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss').slice(1),
          owner = await guild.fetchOwner(),
          ownerCreado = moment(owner.user.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss')[0].toUpperCase() + moment(owner.user.createdAt).format('dddd D [de] MMMM [de] YYYY [a las] hh:mm:ss').slice(1);

    switch(command) {
      case "info": {
         if(interaction.user.id !== "663402246456868894") return interaction.reply({
      content: "En mantenimiento",
      ephemeral: true
    })
        embed.setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ dynamic: true })
        })  
        embed.setDescription(guild.description || 'El servidor no tiene descripción.');
        embed.addField('<:infor:864937020433235998> Información general', `
        **Creado**: ${creada} (${moment(guild.createdAt).fromNow()})\n
**Miembros**: ${guild.memberCount}
**Humanos**: ${guild.members.cache.filter((member) => !member.user.bot).size}
**Bots**: ${guild.members.cache.filter((member) => member.user.bot).size}
**Roles**: ${guild.roles.cache.size}
**Emojis**: ${guild.emojis.cache.size}
**Stickers**: ${guild.stickers.cache.size}\n
**Categorías**: ${guild.channels.cache.filter((cl) => cl.type === "GUILD_CATEGORY").size}
**Canales**: ${guild.channels.cache.size}
     ╠ **De texto**: ${guild.channels.cache.filter((cl) => cl.type === "GUILD_TEXT").size}
     ╠ **De voz**: ${guild.channels.cache.filter((cl) => cl.type === "GUILD_VOICE").size}
     ╠ **De anuncios**: ${guild.channels.cache.filter((cl) => cl.type === "GUILD_NEWS").size}
     ╚ **De escenario**: ${guild.channels.cache.filter((cl) => cl.type === "GUILD_VOICE_STAGE").size}
**Canal AFK**: ${guild.afkChannelId ? guild.channels.cache.get(guild.afkChannelId).toString() : 'No hay.'}\n
**Máxima cantidad de miembros**: ${guild.maximumMembers}
**Máxima cantidad de presencias**: ${guild.maximumPresences || 'Indefinida'}
**Idioma**: ${guild.preferredLocale}
**Widget de servidor**: ${guild.widgetEnabled ? `
Activado.
[Widget Banner 1](https/discordapp.com/api/guilds/${guild.id}/embed.png?style=banner1) [[Widget Banner 2](https/discordapp.com/api/guilds/${guild.id}/embed.png?style=banner2) [[Widget Banner 3](https/discordapp.com/api/guilds/${guild.id}/embed.png?style=banner3) [[Widget Banner 4](https/discordapp.com/api/guilds/${guild.id}/embed.png?style=banner4) [Widget MembersOnline](https/discordapp.com/api/guilds/${guild.id}/embed.png) 
` : 'Desactivado.'}
        `)
        embed.addField(`<:abilities:864936932899422208> Owner`, `
        **Tag**: ${owner.user.username + "#" + owner.user.discriminator}
**ID**: ${owner.user.id}
**Creó su cuenta**: ${ownerCreado} (${moment(owner.user.createdAt).fromNow()})
**Apodo**: ${owner.nickname || 'No tiene.'}
        `)
        embed.addField('<:stats:864936933600002088> Mejoras', `
**Características**:\n${guild.features.length > 0 ? guild.features.map((feat) => "> " + guild_features[feat]).join("\n") : "No tiene." }\n
**Nivel de mejora del servidor**: ${premium_tier[guild.premiumTier]}
              ╚ Cantidad de mejoras: ${guild.premiumSubscriptionCount}
**Barra de progreso**: ${guild.premiumProgressBarEnabled ? 'Activada' : 'Desactivada'}`)
        
        embed.addField('<:utility:864937019687829505> Otros', `
        **Notificaciones**: ${notif_level[guild.defaultMessageNotifications]}\n
**Nivel de 2FA**: ${mfa_level[guild.mfaLevel]}
**Filtro de contenido explícito**: ${exp_content_filter[guild.explicitContentFilter]}
**Nivel de verificación**: ${verif_level[guild.verificationLevel]}
**Nivel de NSFW**: ${nsfw_level[guild.nsfwLevel]}
        `)
        
        
      }
        
        await interaction.followUp({
          embeds: [embed]
        })
        break;
      case "icon": {
        let a = await fetch(interaction.guild.iconURL({ format: "png", size: 256 })).then(x => x.arrayBuffer()).then(decode);
        
        embed.setDescription(`[Enlace al ícono](${interaction.guild.iconURL({ format: "png", size: 512 })})`)
        embed.setColor(a.averageColor().toString(16).slice(0, 6) || embed.color)
        embed.setTimestamp()
        embed.setImage(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        embed.setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true })
        })
        
        await interaction.followUp({
          embeds: [embed]
        })
        
      }
    }
  },
  category: "infos"
}