module.exports = (client, fs) => {
    for(const eventFile of fs.readdirSync(__dirname + '/../events')) {
        const event = require(`../events/${eventFile}`)
        
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))    
        }
    }
}