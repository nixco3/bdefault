const utils = require('discord-utilities-js'),
      translate = require("@iamtraction/google-translate");

module.exports = {
  name: "pokedex",
  description: "Buscas un pokémon en la pokédex.",
  options: [{
    name: "pokemon",
    description: "El nombre del pokémon a buscar.",
    type: 3,
    required: true
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const pkm = interaction.options.getString("pokemon");
    
    try {

		const p = await utils.pokedex(pkm)

		const d = await translate(p.description, {to: 'es'}),
		      t = await translate(p.type.join(", "), {to: 'es'}),
		      s = await translate(p.species.join(", "), {to: 'es'}),
		      a = await translate(p.abilities.join(", "), {to: 'es'});

		embed.setDescription(`**Generación**: ${p.generation.toLocaleString()}\n**Descripción**: ${d.text}\n**Tipo(s)**: ${t.text}\n**Especie(s)**: ${s.text}\n**Habilidades**: ${a.text}`)
		embed.setTimestamp()
		embed.setAuthor(`${p.name} (${p.id.toLocaleString()})`, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png')
		embed.addField('Información general.', `**Peso**: ${p.weight}\n**Altura**: ${p.height}\n**Experiencia base**: ${p.base_experience.toLocaleString()}\n**Género**: ${p.gender.join(", ").replace("male", 'Macho').replace("female", 'Hembra')}\n**Grupo de huevos**: ${p.egg_groups.join(", ")}`)
		embed.addField('Stats.', `**HP**: ${p.stats.hp}\n**Ataque**: ${p.stats.attack}\n**Defensa**: ${p.stats.defense}\n**Ataque especial**: ${p.stats.sp_atk}\n**Defensa especial**: ${p.stats.sp_def}\n**Velocidad**: ${p.stats.speed}\n**Total**: ${p.stats.total}`)
		embed.addField('Familia.', `**Nivel de evolución**: ${p.family.evolutionStage}\n**Evoluciones**: ${p.family.evolutionLine.join(" -> ")}`)
		embed.setImage(p.sprites.animated || null)
		embed.setThumbnail(p.sprites.normal || null)

		await interaction.followUp({
			embeds: [embed]
		})

	} catch(err) {
		await interaction.followUp({
				content: "No pude encontrar información sobre ese pokémon en la pokédex." 
			})
	}
    
  },
  category: "searchs"
}