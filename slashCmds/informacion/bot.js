const d = require("node-os-utils");

module.exports = {
  "name": "bot",
  "description": "Cosas sobre Default.",
  "options": [
    {
      "type": 1,
      "name": "invite",
      "description": "Retorna el enlace de invitación del bot.",
      "options": []
    },
    {
      "type": 1,
      "name": "info",
      "description": "Devuelve información acerca del bot.",
      "options": []
    },
    {
      "type": 1,
      "name": "ping",
      "description": "Devuelve el ping del bot.",
      "options": []
    },
    {
      "type": 1,
      "name": "help",
      "description": "Comandos del bot.",
      "options": []
    }
  ],
    async execute(client, interaction, embed) {
        await interaction.deferReply();
        const command = interaction.options.getSubcommand("bot");

        let app = await client.application.fetch();
        
        if(command === "invite") {
            return await interaction.followUp({
                embeds: [{description: "[Cliquea aquí para invitarme a tu servidor](https://discord.com/api/oauth2/authorize?client_id=886966689940529152&permissions=533851405376&scope=bot%20applications.commands)", color: embed.color, timestamp: Date.now()}],
                ephemeral: false
            })
        } else if (command === "info") {
          let os = d.os,
              mem = await d.mem.info(),
              proc = d.proc,
              netstat = d.netstat;

            let c = [];
let a = client.slashCommands.map(c => c).filter(x => x.options && x.options[0].type == 1).map(c => c.options).forEach((p) => p.forEach(v => c.push(v.name)))
          
            embed.addField('Información general', `\`\`\`\n
Desarrollador: ${app.owner.username + "#" + app.owner.discriminator}
Librería: discord.js@${require("discord.js").version}
Tiempo encendido: ${require("humanize-duration")(client.uptime, {language: "es", units: ["d", "h", "m", "s"], round: true, conjunction: " y ", delimiter: ", ", serialComma: false})}
Slash Commands: ${client.slashCommands.size}
Sub Commands: ${c.length}\n\n
Servers: ${client.guilds.cache.size.toLocaleString()}
Usuarios: ${client.users.cache.size.toLocaleString()}
Roles: ${eval(client.guilds.cache.map((c) => c.roles.cache.size).join("+"))}
Canales: ${client.channels.cache.size.toLocaleString()}
\`\`\``)
          embed.addField("Bot", `\`\`\`js\n
S.O: ${await os.platform()}, ${await os.oos()} ${await os.arch()}
Tiempo del proceso encendido: ${require("humanize-duration")(await os.uptime(), {language: "es", units: ["d", "h", "m", "s"], round: true, conjunction: " y ", delimiter: ", ", serialComma: false})}

Memoria: 
Disponible: ${mem.freeMemMb}mb (${mem.freeMemPercentage}%)
Usada: ${mem.usedMemMb}mb (${mem.usedMemPercentage}%)
Total: ${mem.totalMemMb}mb 
\`\`\``)
            embed.setAuthor({
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL({
                    dynamic: true
                })
            })            
        
        return await interaction.followUp({
            embeds: [embed]
        })
        } else if (command === "ping") {
            
    embed.setDescription(`WebSocket: \`${client.ws.ping}ms\`\nInteracciones: \`${Date.now() - interaction.createdAt}ms\``)
      embed.setColor('5865f2')
      embed.setTimestamp()

    await interaction.followUp({
      embeds: [embed]
    })
        } else if (command === "help") {
          
           let ca = [];
let cac = client.slashCommands.map(c => c).filter(x => x.options && x.options[0].type == 1).map(c => c.options).forEach((p) => p.forEach(v => ca.push(v.name)))
          
          
          let SEARCH = client.slashCommands.filter(x => x.category === "searchs" && x.options).map(c => `${c.name} ${c.options[0].type == 1 ? '[' : '('}${c.options.map(v => `\`${v.name}\``).join(", ")}${c.options[0].type == 1 ? ']' : ')'}`);
          let INFOS = client.slashCommands.filter(x => x.category === "infos" && x.options).map(c => `${c.name} ${c.options[0].type == 1 ? '[' : '('}${c.options.map(v => `\`${v.name}\``).join(", ")}${c.options[0].type == 1 ? ']' : ')'}`);
          let FUNS = client.slashCommands.filter(x => x.category === "funs" && x.options).map(c => `${c.name} ${c.options[0].type == 1 ? '[' : '('}${c.options.map(v => `\`${v.name}\``).join(", ")}${c.options[0].type == 1 ? ']' : ')'}`);
          let UTILITYS = client.slashCommands.filter(x => x.category === "utilitys" && x.options).map(c => `${c.name} ${c.options[0].type == 1 ? '[' : '('}${c.options.map(v => `\`${v.name}\``).join(", ")}${c.options[0].type == 1 ? ']' : ')'}`);
          client.slashCommands.filter(x => x.category === "searchs" && !x.options).forEach(x => SEARCH.push(x.name))
          client.slashCommands.filter(x => x.category === "infos" && !x.options).forEach(x => INFOS.push(x.name))
          client.slashCommands.filter(x => x.category === "funs" && !x.options).forEach(x => FUNS.push(x.name))
          client.slashCommands.filter(x => x.category === "utilitys" && !x.options).forEach(x => UTILITYS.push(x.name))
          
          embed.setDescription(`**${client.slashCommands.size}** Slash Commands\n**${ca.length}** Subcommands.`)
          embed.setAuthor({
            name: client.user.tag,
            iconURL: client.user.displayAvatarURL()
          })
          embed.addField('<:utility:864937019687829505> Búsquedas', SEARCH.map(c => `/${c}`).join("\n"))
          embed.addField('<:extra:864937990177423360> Información', INFOS.map(c => `/${c}`).join("\n"))
          embed.addField('<:divmedia:864936854041788466> Diversión', FUNS.map(c => `/${c}`).join("\n"))
          embed.addField('<:extra2:864937020941139978> Utilidad', UTILITYS.map(c => `/${c}`).join("\n"))
          embed.setFooter({
            text: `[]: Sub-comando | (): Opción del comando`
          })
          embed.setImage("https://cdn.glitch.global/adb3e769-38ad-48bb-b5cf-f53ed0e64df2/Default.png?v=1648995254996")
          embed.setTimestamp()
          
          await interaction.followUp({
            embeds: [embed]
          })
        }
    },
  category: "infos"
}