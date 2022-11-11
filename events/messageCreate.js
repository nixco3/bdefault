const Discord = require('discord.js'),
    cooldowns = new Discord.Collection();

let prefix = "d/";

module.exports = {
  name: "messageCreate",
  async execute(message, client) {

      // CONDICIONALES
      
    if (message.author.bot) return;
    if (message.content.match(new RegExp(/^<@!?886966689940529152>$/ig))) return message.channel.send({content: `Hola, soy ${client.user.tag}. ¿Qué necesitas?\nPuedes ver mis comandos usando \`/bot help\``});
    if (message.channel.type === 'dm') return;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    // ARGUMENTOS
      
    const args = message.content.slice(prefix.length).trim().split(/ +/),
        commandName = args.shift().toLowerCase(),
        command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // COOLDOWN DE COMANDOS
      
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        const embed = new Discord.MessageEmbed()
          .setDescription(`⏲️ Espera! Puedes volver a usar el comando en ${timeLeft.toFixed(0)} segundo(s).`)
          .setColor('RED')
        return message.reply({
          embeds: [embed]
        }).then(msg => setTimeout(() => msg.delete(), Math.floor(timeLeft * 1000)))
      }
      return;
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // CONDICIONAL COMANDOS DE DEVELOPER.

    if (command.devOnly === true && !["858750775705600060", "663402246456868894", "853043679160827914", "735295378563399711", "222167423426494466"].includes(message.author.id)) return;

    // RUN COMMAND
      
    try {
      command.execute(message, args, client, prefix);
    } catch (err) {
      message.channel.send({
        content: `Ha ocurrido un error ejecutando el comando.\n\`${err.message}\``
      });
      console.log(err)
    }
  }
}