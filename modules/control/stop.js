module.exports = {
    commands: 'stop',
    minArgs: 0,
    maxArgs: 0,
    perms: 'ADMINISTRATOR',
    callback: (message) => {
        let client = message.client
        console.log(`${message.author} requested SHUT DOWN.`);
        console.warn("🟥 > Bot is now SHUTTING DOWN.");
        message.reply("🟥 > Shutting down.");
        client.user.setPresence({status: "invisible"});
        setTimeout(() => {
               client.destroy();
               process.exit()
        }, 5000);
    },
}