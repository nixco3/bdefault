const { execSync } = require("child_process");

module.exports = {
  name: "exec",
  aliases: ["ex", "npminstall"],
  devOnly: true,
  async execute(message, args, client) {
    if(!args[0]) return;
    try {
   let ejecutado = await execSync(args.join(" "))
    
     message.channel.send({
       embeds: [{
         description: `\`\`\`js\n${ejecutado.slice(0, 4000)}\`\`\``,
         color: "#5865f2",
         timestamp: Date.now()
       }]
     })
   } catch(err) {
      message.channel.send({
       embeds: [{
         description: `\`\`\`js\n${err.message}\`\`\``,
         color: "#5865f2",
         timestamp: Date.now()
       }]
     })
    }
    
  }  
}