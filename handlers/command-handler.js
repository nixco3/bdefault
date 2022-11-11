module.exports = (client, fs) => {
    for (const categoryFolder of fs.readdirSync(__dirname + '/../commands')) {
    for (const commandFile of fs.readdirSync(__dirname + `/../commands/${categoryFolder}`)) {
        const command = require(`../commands/${categoryFolder}/${commandFile}`);
        client.commands.set(command.name, command);
    }
}

}