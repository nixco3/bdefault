const Discord = require("discord.js");
module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		const embed = new Discord.MessageEmbed()
			.setColor("6f1bfd");

		if (interaction.isCommand()) {
			const cmd = client.slashCommands.get(interaction.commandName);
			if (!cmd) return;
			try {
				cmd.execute(client, interaction, embed)
			} catch (err) {
                console.log(err.mesage)
				await interaction.reply({
					content: "Ha ocurrido un error ejecutando el comando.",
                    ephemeral: true
				})
			}
		}
	}
}