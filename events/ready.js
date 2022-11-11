module.exports = {
    name: "ready",
    once: true,
    async execute(_, client) {
        console.log("Conectado correctamente.")
        
        client.user.setActivity({
            name: "invitame!",
            type: "LISTENING"
        })
        
        const commands = client.slashCommands.map((cmd) => cmd);
        client.application.commands.set(commands)
    }
}