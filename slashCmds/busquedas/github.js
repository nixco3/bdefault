const fetch = require("node-fetch"),
      moment = require("moment");

moment.locale("es")

module.exports = {
  name: "github",
  description: "Realizas una búsqueda en GitHub",
  options: [{
    name: "user",
    description: "Buscar usuarios de GitHub",
    type: 1,
    options: [{
      name: "usuario",
      description: "Nombre del usuario a buscar en GitHub",
      type: 3,
      required: true
    }]
  }, {
    name: "repository",
    description: "Buscar repositorios de GitHub",
    type: 1,
    options: [{
      name: "repositorio",
      description: "Nombre del repositorio a buscar en GitHub",
      type: 3,
      required: true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand("github");
    
    if(command === "user") {
      fetch(`https://api.github.com/users/${encodeURIComponent(interaction.options.getString("usuario"))}`).then(res => res.json()).then(async (data) => {
            
            if(!data.login) return await interaction.followUp({
              content: "No logré encontrar a ese usuario."
            })
        
            embed.setAuthor(data.login, 'https://img.icons8.com/small/452/github.png')
            embed.setURL(data.html_url)
            embed.setDescription(`**Apodo:** ${data.name ? data.name : 'No tiene apodo.'}\n**Biografía:** ${data.bio ? data.bio : 'Este usuario no tiene una biografía.'}\n**Blog:** ${data.blog ? data.blog : 'No tiene.'}\nCreado el ${moment(data.created_at).format('dddd DD [de] MMMM [de] YYYY [a las] hh:mm:ss')} (${moment(data.created_at).fromNow()})`)
            embed.setThumbnail(data.avatar_url ? data.avatar_url : null)
            embed.setTimestamp()
            embed.addField('<:info:864929731278536706> Información', `**Compañía**: ${data.company ? data.company : 'No especificada.'}\n**Repositorios**: ${data.public_repos.toLocaleString()}`)
            embed.addField('<:stats:864858145331085362> Social', `**Twitter:** ${data.twitter_username ? data.twitter_username : 'No tiene un Twitter asociado.'}\n**Seguidos**: ${data.following.toLocaleString()}\n**Seguidores**: ${data.followers.toLocaleString()}`)
            embed.setColor('#5865f2')

            await interaction.followUp({
                embeds: [embed]
            })
        })
    } else if (command === "repository") {
      let filter = (i) => i.author.id === interaction.user.id;
      fetch(`https://api.github.com/search/repositories?q=${encodeURI(interaction.options.getString("repositorio").split(" ").join("-"))}`).then(res => res.json()).then(async (d) => {
            if(d.items.length === 0) {

            
            await interaction.followUp({content: "No logré encontrar ese repositorio."})
            return;
            }
        
            const results = [];
            let result = 0;
            for(const item in d.items) {
                if(item == 10) {
                    break;
                }
                results.push(d.items[item].full_name)
            }

            embed.setDescription(`${results.map(c => `[\`${result++}\`] ${c}`).join("\n")}`)
            embed.setColor('#5865f2')
            embed.setTimestamp()
            embed.setFooter({text: 'Mostrando 10 resultados. Tienes 15 segundos para elegir uno.'})
            embed.setThumbnail('https://img.icons8.com/small/452/github.png')
            await interaction.followUp({embeds: [embed]}).then(async (m) => {
                interaction.channel.awaitMessages({filter, max: 1, time: 15000, errors: ["time"]}).then(async (msg) => {
                    const nr = parseInt(msg.first().content);

                    if(isNaN(nr)) {
                      
                      m.edit({content: "Ingresa un resultado válido."})
                      return;
                    } 

                    if(nr > 9 || nr > d.items.length) {
                      m.edit({content: "Ingresa un resultado de los que te dí."})
                    return;
                    }

                    embed.setAuthor(`${d.items[nr].full_name}`, d.items[nr].owner.avatar_url ? d.items[nr].owner.avatar_url : null)
                    embed.setDescription(`**ID**: ${d.items[nr].id}\n**Descripción**: ${d.items[nr].description ? d.items[nr].description : 'No especificada.'}\n**Página principal**: ${d.items[nr].homepage ? `[Link](${d.items[nr].homepage})` : 'No tiene.'}`)
                    embed.addField('<:info:864929731278536706> Información:', `**Lenguaje:** ${d.items[nr].language ? d.items[nr].language : 'No definido.'}\n**Forks**: ${d.items[nr].forks_count}\n**Observadores:** ${d.items[nr].watchers ? d.items[nr].watchers : 'Ninguno.'}\n**Tamaño**: ${d.items[nr].size.toLocaleString()}Kb\n**Creado:** ${moment(d.items[nr].created_at).format('dddd DD [de] MMMM [de] YYYY [a las] hh:mm:ss')} (${moment(d.items[nr].created_at).fromNow()})\n**Última vez actualizado:** ${moment(d.items[nr].updated_at).format('dddd DD [de] MMMM [de] YYYY [a las] hh:mm:ss')} (${moment(d.items[nr].updated_at).fromNow()})\n**Consultas pendientes**: ${d.items[nr].open_issues_count ? d.items[nr].open_issues_count : 'Ninguna.'}`)
                    embed.addField('<:otherUtility:864929729256882176> Links', `\n[clone](${d.items[nr].clone_url})\n[svn](${d.items[nr].svn_url})\n`)
                    embed.setColor('#5865f2')
                    embed.setTimestamp()
                    embed.setFooter({
                      text: "\u200b"
                    })

                    if(d.items[nr].name) {
                        embed.setTitle(`${d.items[nr].name}`)
                        embed.setURL(d.items[nr].url)
                    }

                    m.edit({embeds: [embed]}) 
                    if(interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    msg.first().delete()
                }
                }).catch(async (err) => {
                    await interaction.followUp({
                        content: "No respondiste."
                    })
                })
            })
        })
    }
  },
  category: "searchs"
}