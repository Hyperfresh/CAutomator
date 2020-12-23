module.exports = {
    commands: 'stop',
    minArgs: 0,
    maxArgs: 0,
    perms: 'ADMINISTRATOR',
    callback: (message, text) => {
        console.log(`${message.author} requested SHUT DOWN.`);
        console.warn("🟥 > Bot is now SHUTTING DOWN.");
        message.reply("🟥 > Shutting down.");
        client.user.setPresence({status: "invisible"});
        setTimeout(() => {
               client.destroy();
        }, 5000);
    },
}