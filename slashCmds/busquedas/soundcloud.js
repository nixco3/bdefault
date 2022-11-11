const SoundCloud = require("soundcloud-scraper");

module.exports = {
  name: "soundcloud",
  description: "Comandos sobre soundcloud.",
  options: [{
    name: "song",
    description: "Buscas una canción en soundcloud.",
    type: 1,
    options: [
      {
        name: "titulo",
        description: "El nombre de la canción a buscar",
        type: 3,
        required: true
      }
    ]
  }, {
    name: "artist",
    description: "Buscas un artista en soundcloud.",
    type: 1,
    options: [
      {
        name: "artista",
        description: "El nombre del artista a buscar",
        type: 3,
        required: true
      }
    ]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const SClient = new SoundCloud.Client();
    
    switch(interaction.options.getSubcommand()) {
      case "song": {
       try {
          let r = await SClient.search(interaction.options.getString("titulo"), "track")
  
        if(!r[0] || !r[0].url) return await interaction.followUp({
          content: "No encontré información acerca de esa canción."
        })

        let r2 = await SClient.getSongInfo(r[0].url)
        require("moment").locale("es")
         let fecha = require("moment")(r2.publishedAt).format("LLLL")
        
        embed.setAuthor({
          name: r2.author.name,
          iconURL: r2.author.avatarURL || null,
          url: r2.author.url || "https://soundcloud.com"
        })
        embed.setTitle(r2.title)
        embed.setURL(r2.url)
        embed.setDescription(r2.description || "Esta canción no tiene una descripción.")
        embed.setThumbnail(r2.thumbnail || null)
        embed.addField('Autor', `**Nombre de Usuario**: ${r2.author.username}\n**[LINK A SU PERFIL](${r2.author.url})**\n**¿Verificado?** ${r2.author.verified ? "Sí" : "No"}\n**Seguidores**: ${r2.author.followers.toLocaleString()}\n**Seguidos**: ${r2.author.following.toLocaleString()}`)
        embed.addField('Canción', `**Likes**: ${r2.likes.toLocaleString()}\n**Comentarios**: ${r2.commentsCount.toLocaleString()}\n**Veces escuchada**: ${r2.playCount.toLocaleString()}\n**Género**: ${r2.genre}\n**Duración**: ${require("humanize-duration")(r2.duration, {language: "es", conjunction: " con ", delimiter: ", "})}\n**Publicada**: ${fecha.replace(fecha.charAt(0), fecha.charAt(0).toUpperCase())} (${require("moment")(r.publishedAt).fromNow()})`)
      
        await interaction.followUp({
          embeds: [embed]
        })
       } catch(err) {
         await interaction.editReply({
           content: "Ocurrió un error ejecutando este comando."
         })
       }
      }
        break;
      case "artist": {
          try {
            let r = await SClient.search(interaction.options.getString("artista"), "artist")
  
        if(!r[0] || !r[0].url) return await interaction.followUp({
          content: "No encontré información acerca de ese artista."
        })
        let r2 = await SClient.getUser(r[0].url)
        
        require("moment").locale("es")
        let fecha = require("moment")(r2.createdAt).format("LLLL")
        
        embed.setTitle(r2.name)
        embed.setURL(r2.profile || "https://soundcloud.com")
        embed.setThumbnail(r2.avatarURL || null)
        embed.addField('Información del Artista', `**¿Verificado?** ${r2.verified ? "Sí" : "No"}\n**Seguidores**: ${r2.followers}\n**Seguidos**: ${r2.following}\n**Canciones**: ${r2.tracksCount}\n**Likes dados**: ${r2.likesCount}\n**Creó su Cuenta**: ${fecha.replace(fecha.charAt(0), fecha.charAt(0).toUpperCase())} (${require("moment")(r2.createdAt).fromNow()})`)
        embed.addField('Canciones', r2.tracks ? r2.tracks.map((track) => `[${track.title}](${track.url})\nDuración: ${require("humanize-duration")(track.duration, {language: "es", conjunction: " con ", delimiter: ", "})} | Género: ${track.genre}`).slice(0, 5).join("\n\n").slice(0, 1020) : "__No tiene__.")
        embed.setFooter({
          text: "En las canciones solo se llegan a mostar 5 por limitaciones de Discord."
        })
        embed.setImage(r2.bannerURL || null)
        
        await interaction.followUp({
          embeds: [embed]
        })
        
        } catch(err) {
          await interaction.editReply({
            content: "Ocurrió un error ejecutando este comando."
          })
        }
      }
        break;
    }
    
  },
  category: "searchs"
}