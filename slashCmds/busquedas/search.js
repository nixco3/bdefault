const fetch = require("node-fetch"),
      translate = require("@iamtraction/google-translate");

module.exports = {
  name: "search",
  description: "Comandos de búsquedas.",
  options: [
    {
      type: 1,
      name: "twitter-user",
      description: "Buscas un usuario en Twitter.",
      options: [
        {
          type: 3,
          name: "usuario",
          description: "El nombre del usuario a buscar en Twitter.",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "dictionary",
      description: "Buscas una palabra en el diccionario.",
      options: [
        {
          type: 3,
          name: "palabra",
          description: "Palabra a buscar.",
          required: true,
          choices: [],
        },
      ],
    },
    {
      name: "lyrics",
      description: "Buscas la letra de alguna canción.",
      type: 1,
      options: [
        {
          name: "titulo",
          description: "El título de la canción",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "hex-color",
      description: "Ves información acerca de un hex.",
      type: 1,
      options: [
        {
          name: "color",
          description: "El color a ver su información.",
          type: 3,
          required: true,
        },
      ],
    },
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    switch (interaction.options.getSubcommand("search")) {
      case "twitter-user":
        {
          const name = interaction.options.getString("usuario");

          fetch(
            `https://api.twitter.com/1.1/users/show.json?screen_name=${encodeURIComponent(
              name.toLowerCase()
            )}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.TWITTER}`,
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then(async (data) => {
              embed.setTitle(
                data.verified
                  ? data.screen_name + " <:verificado:866484219604369428>"
                  : data.screen_name
              );
              embed.setThumbnail(data.profile_image_url);
              embed.setImage(
                data.profile_banner_url
                  ? data.profile_banner_url
                  : data.profile_background_image_url_https
              );
              embed.setDescription(
                `Nombre: **@${data.screen_name}**\nDescripción: ${
                  data.description
                    ? data.description
                    : "Este usuario no tiene descripción."
                }`
              );
              embed.addField('Ubicación', `${
                  data.location
                    ? `${data.location}`
                    : "Este usuario no especificó su ubicación."
                }`)
              embed.addField(`Se unió a Twitter`, `${data.created_at
                  .split(" +0000 ")
                  .join(" ")}`)
              embed.addField(
                "<:tweets:866503027451101205> Tweets",
                data.statuses_count.toLocaleString(),
                true
              );
              embed.addField(
                "<:seguidos:866494342745948210> Seguidos",
                data.friends_count.toLocaleString(),
                true
              );
              embed.addField(
                "<:seguidores:866494343395934268> Seguidores",
                data.followers_count.toLocaleString(),
                true
              );
              embed.setTimestamp();
              embed.setColor("#5865f2");
              embed.setFooter({
                text: `Cantidad de ❤️ dados: ${data.favourites_count}`,
              });

              await interaction.followUp({
                embeds: [embed],
              });
            })
            .catch(async (err) => {
              console.log(err.message);
              await interaction.followUp({
                content:
                  "El usuario que intentas buscar no existe o tiene su cuenta en privado.",
              });
            });
        }
        break;
      case "dictionary":
        {
          const palabra = interaction.options.getString("palabra");
          const aBuscar = await translate(palabra, { to: 'en' })
          
          
          fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
              aBuscar.text
            )}`
          )
            .then((x) => x.json())
            .then(async (d) => {
            console.log(d)
              embed.setColor("RANDOM");
              embed.setThumbnail(
                "http://assets.stickpng.com/images/580b585b2edbce24c47b276f.png"
              );
            embed.setFooter({
              text: "Las definiciones son conseguidas de un diccionario en inglés y traducidas con Google Translator, esto significa que no siempre van a ser precisas."
            })

              const translate = require("@iamtraction/google-translate");

              for (const def in d) {
                if (def === 23) break;
                let www2 = await translate(d[def].meanings[0].definitions[0].definition || "Undefined", {to:"es"})
                let www = await translate(d[def].meanings[0].definitions[0].example || "Not specified.", {to:"es"})
                let www3 = await translate(d[def].word, {to: "es"})
                embed.addField(
                  `${www3.text} (${d[def].word})`,
                  `${
                    www2.text
                  }\n\n**Ejemplos**:\n${
                    www.text ||
                    "No especificado."
                  }`
                );
              }
              await interaction.followUp({
                embeds: [embed],
              });
            })
            .catch(async (err) => {
              await interaction.followUp({
                content:
                  "No pude encontrar esa palabra en el diccionario. :pensive:",
              });

              console.log(err);
            });
        }
        break;
      case "lyrics":
        {
          fetch(
            `https://some-random-api.ml/lyrics?title=${encodeURIComponent(
              interaction.options.getString("titulo")
            )}`
          )
            .then((x) => x.json())
            .then(async (song) => {
              embed.setAuthor({
                name: song.author,
                iconURL: song.thumbnail.genius || null,
              });
              embed.setTitle(song.title);
              embed.setURL(song.links.genius);

              if (song.lyrics.length >= 4000) {
                if(song.lyrics.length >= 36000) {
                  return interaction.followUp({
                    content: "La letra de la canción es demasiado larga como para enviarla."
                  })
                }
                
               let a = require("discord.js").Util.splitMessage(song.lyrics, { maxLength: 4000 })
               
               a.map(async (c) => {
                 embed.setDescription(c)
                 await interaction.followUp({
                   embeds: [embed]
                 })
               })
              } else {
                embed.setDescription(song.lyrics);

                await interaction.followUp({
                  embeds: [embed],
                });
              }
            })
            .catch(async (err) => {
              console.log(err);
              await interaction.followUp({
                content: "No pude encontrar esa canción."
              });
            });
        }
        break;
      case "hex-color":
        {
          if(interaction.options.getString("color").toLowerCase() === "random") {
                fetch(`https://api.alexflipnote.dev/color/random`).then(res => res.json()).then(async (c) => {
                embed.setTitle(c.name)
                embed.setDescription(`Nivel de brillo: ${c.brightness}\nHex: ${c.hex}\nRGB: ${c.rgb}`)
                embed.addField('Sombras:', c.shade.join(", "))
                embed.addField('Tintes:', c.tint.join(", "))
                embed.setColor(c.hex)
                embed.setTimestamp()
                embed.setImage(c.image_gradient)
                  
                await interaction.followUp({
                  embeds: [embed]
                })
}).catch(async (err) => {
                  await interaction.followUp({
                    content: "Ocurrió un error."
                  })
                })
            return;
          }
          
           let regexp = new RegExp(/^#?[a-fA-F0-9]{6}$/ig).test(interaction.options.getString("color"))
           
           if(regexp) {
              let color = interaction.options.getString("color")
            if(color.startsWith('#')) {
                color = color.slice(1)
            }
            fetch(`https://api.alexflipnote.dev/color/${color}`).then(res => res.json()).then(async (c) => {
                embed.setTitle(c.name)
                embed.setDescription(`Nivel de brillo: ${c.brightness}\nHex: ${c.hex}\nRGB: ${c.rgb}`)
                embed.addField('Sombras:', c.shade.join(", "))
                embed.addField('Tintes:', c.tint.join(", "))
                embed.setColor(color)
                embed.setTimestamp()
                embed.setImage(c.image_gradient)

                await interaction.followUp({
                    embeds: [embed]
                })
            }).catch(async (err) => {
                embed.setDescription('Hubo un error intentando conseguir la información de este color.')
                await interaction.followUp({
                    embeds: [embed]
                })
            });
           } else {
             await interaction.followUp({
               content: "Ingresa un hex-color válido."
             })
           }
        }
        break;
    }
  },
  category: "searchs"

};
