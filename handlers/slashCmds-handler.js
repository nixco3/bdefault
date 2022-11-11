module.exports = (client, fs) => {
    for (const categoryFolder of fs.readdirSync(__dirname + '/../slashCmds')) {
    for (const commandFile of fs.readdirSync(__dirname + `/../slashCmds/${categoryFolder}`)) {
        const command = require(`../slashCmds/${categoryFolder}/${commandFile}`);
        client.slashCommands.set(command.name, command);
    }
}

}