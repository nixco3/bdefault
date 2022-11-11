const ytsr = require("ytsr"),
      { MessageButton, MessageActionRow } = require("discord.js"),
      translate = require("@iamtraction/google-translate"),
      fetch = require("node-fetch");

module.exports = {
  name: "youtube",
  description: "Buscas un canal o video en YouTube.",
  options: [{
    name: "channel",
    description: "Buscas un canal de YouTube",
    type: 1,
    options: [{
      name: "nombre",
      description: "Nombre del canal a buscar.",
      type: 3,
      required: true
    }]
  }, {
    name: "video",
    description: "Buscas un video en YouTube",
    type: 1,
    options: [{
      name: "titulo",
      description: "Algun título para buscar un video.",
      type: 3,
      required: true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand("youtube");
    
    switch(command) {
      case "channel": {
        
        const busqueda = await ytsr(interaction.options.getString("nombre"), {
          limit: 100
        }),
              result = busqueda.items.filter((r) => r.type === "channel")[0];
        
        if(!result) {
          return await interaction.followUp({
            content: "No encontré ese canal de YouTube"
          });
        }
        
        
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${result.channelID}&key=${process.env.GOOGLEAPIKEY}`, {
          method: "GET"
        }).then(ff => ff.json()).then(async (u) => {
          
        embed.setTitle(result.verified ? result.name + " <:YTverified:947179156913926154>" : result.name)
        embed.setDescription(u.items[0].brandingSettings.channel.description || 'Este canal no tiene descripción.')
        embed.addField('Información general', `Suscriptores: ${result.subscribers ? result.subscribers.split(" ")[0] : "0"}\nVideos: ${result.videos ? result.videos : "0"}`)
        embed.setThumbnail(result.bestAvatar.url || null)
        embed.setTimestamp();
        embed.setImage(u.items[0].brandingSettings.image.bannerExternalUrl || null)
        
        
          await interaction.followUp({
          embeds: [embed]
        })
            
        }).catch(async (err) => {
          await interaction.followUp({
            content: "La búsqueda no arrojó resultados."
          })
          console.log(err)
        })
        
    }
      break;
      case "video": {
       const filter = a => a.user.id === interaction.user.id;

		let r = await ytsr(interaction.options.getString("titulo"), {
			safeSearch: true,
			limit: 50,
		})

		let rA = 0;
		let status = false;

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103523647467530')
			.setCustomId('back')
			.setDisabled(status),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103486053941248')
			.setCustomId('stop')
			.setDisabled(status),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103522741510144')
			.setCustomId('next')
			.setDisabled(status),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103494530613289')
			.setCustomId('random')
			.setDisabled(status),
			new MessageButton()
			.setStyle('DANGER')
			.setEmoji('897103493578489876')
			.setCustomId('close')
			.setDisabled(status),
			)

		let result = r.items.filter(x => x.type === 'video')

		if(!result[0]) {
			return await interaction.followUp({
			  content: "No encontré resultados sobre tu búsqueda."
      });
		}

		let tr = await translate(result[rA].uploadedAt, {to: 'es'})

		embed.setAuthor(result[rA].author.name, result[rA].author.bestAvatar.url || null, result[rA].author.url)
		embed.setImage(result[rA].bestThumbnail.url || null)
		embed.setDescription(`**[${result[rA].title}](${result[rA].url})**\n\n**Vistas**: ${result[rA].views.toLocaleString()}\n**Duración**: ${result[rA].duration}\n**Subido**: ${tr.text}`)
		embed.setColor('#5865f2')
		embed.setFooter(`Resultado ${rA} de ${result.length}`)

		await interaction.followUp({
			embeds: [embed],
			components: [row]
		}).then(async (msg) => {
			const collector = msg.createMessageComponentCollector({filter, idle: 30000})				
				
		// EMPIEZA EL COLECTOR		

			collector.on('collect', async (int) => {
        await int.deferUpdate();
				if(!int.isButton()) return;

				if(int.customId === 'back') {
					if(rA <= 0) {
						return;
					} else {
						rA--

		embed.setAuthor({name: result[rA].author.name, iconURL: result[rA].author.bestAvatar.url || null})
		embed.setImage(result[rA].bestThumbnail.url || null)
		embed.setDescription(`**[${result[rA].title}](${result[rA].url})**\n\n**Vistas**: ${result[rA].views.toLocaleString()}\n**Duración**: ${result[rA].duration}\n**Subido**: ${tr.text}`)
		embed.setColor('#5865f2')
		embed.setFooter({text : `Resultado ${rA} de ${result.length}`})
					
							await int.editReply({
							embeds: [embed],
							components: [row]
						})
					}
				}

				if(int.customId === 'stop') {

					const row2 = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103523647467530')
			.setCustomId('back')
			.setDisabled(true),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103486053941248')
			.setCustomId('stop')
			.setDisabled(true),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103522741510144')
			.setCustomId('next')
			.setDisabled(true),
			new MessageButton()
			.setStyle('PRIMARY')
			.setEmoji('897103494530613289')
			.setCustomId('random')
			.setDisabled(true),
			new MessageButton()
			.setStyle('DANGER')
			.setEmoji('897103493578489876')
			.setCustomId('close')
			.setDisabled(true),
			)

							await int.editReply({
							components: [row2]
						})
					collector.stop()
				}
	
				if(int.customId === 'next') {
					if(rA >= 49) {
						return;
					} else {
						rA++
            
		embed.setAuthor({name: result[rA].author.name, iconURL: result[rA].author.bestAvatar.url || null})
		embed.setImage(result[rA].bestThumbnail.url || null)
		embed.setDescription(`**[${result[rA].title}](${result[rA].url})**\n\n**Vistas**: ${result[rA].views.toLocaleString()}\n**Duración**: ${result[rA].duration}\n**Subido**: ${tr.text}`)
		embed.setColor('#5865f2')
		embed.setFooter({text: `Resultado ${rA} de ${result.length}`})

							await int.editReply({
							embeds: [embed],
							components: [row]
						})
					}
				}

					if(int.customId === 'random') {
						rA = Math.floor(Math.random() * 50)
		embed.setAuthor({name: result[rA].author.name, iconURL: result[rA].author.bestAvatar.url || null})
		embed.setImage(result[rA].bestThumbnail.url || null)
		embed.setDescription(`**[${result[rA].title}](${result[rA].url})**\n\n**Vistas**: ${result[rA].views.toLocaleString()}\n**Duración**: ${result[rA].duration}\n**Subido**: ${tr.text}`)
		embed.setColor('#5865f2')
		embed.setFooter({text: `Resultado ${rA} de ${result.length}`})
							await int.editReply({
							embeds: [embed],
							components: [row]
						})
					
				}
	
		if(int.customId === 'close') {

		embed.setAuthor({name: result[rA].author.name, iconURL: result[rA].author.bestAvatar.url || null})
		embed.setImage(result[rA].bestThumbnail.url || null)
		embed.setDescription(`**[${result[rA].title}](${result[rA].url})**\n\n**Vistas**: ${result[rA].views.toLocaleString()}\n**Duración**: ${result[rA].duration}\n**Subido**: ${tr.text}`)
		embed.setColor('#5865f2')
		embed.setFooter({text: `Resultado ${rA} de ${result.length}`})
							await int.editReply({
							embeds: [embed],
							components: []
						})
					collector.stop()
				}

			});

		});
      }
      break;
    }
  }, 
  category: "searchs"
}