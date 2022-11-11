const findImage = async(int) => {
  let image = int.options.getUser("usuario") ? int.options.getUser("usuario").id === int.user.id ? int.user.displayAvatarURL({ format: "png", size: 256 }) : int.options.getUser("usuario").displayAvatarURL({ format: "png", size: 256 }) : int.channel.messages.fetch({limit: 100}).then(x => x.filter(c => c.attachments.size > 0 && ["image/jpeg", "image/png"].includes(c.attachments.first().contentType.toLowerCase())).map(c => c.attachments.first().url)[0]) || int.user.displayAvatarURL({ format: "png", size: 256 })
  return image;
}

const findImageMessage = async(msg) => {
  let image = msg.mentions.users.first() ? msg.mentions.users.first().id === msg.author.id ? msg.mentions.users.first().displayAvatarURL({ format: "png", size: 512 }) : msg.mentions.users.first().displayAvatarURL({ format: "png", size: 512 }) : msg.channel.messages.fetch({limit: 100}).then(x => x.filter(c => c.attachments.size > 0).map(c => c.attachments.first().url)[0]) || msg.author.displayAvatarURL({ format: "png", size: 512 })
  return image;
}

module.exports = {
  findImage,
  findImageMessage
}