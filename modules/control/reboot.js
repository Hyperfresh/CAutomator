module.exports = {
    commands: 'reboot',
    minArgs: 0,
    maxArgs: 0,
    perms: 'ADMINISTRATOR',
    callback: (message) => {
        let client = message.client;
        console.log(`🟨 > ${message.author} requested REBOOT.`);
        message.reply("🟨 > Rebooting.");
        client.user.setPresence({
            status:"dnd",activity:{
                    name:"Rebooting...",type:"PLAYING"
            }
        });
        console.warn("🟨 > Bot is now REBOOTING.");
        setTimeout(() => {
            client.destroy();
            setTimeout(() => {
                client.login(config.BOT_TOKEN);
                setTimeout(() => {
                        ready();
                }, 3000);
        }, 5000);

        }, 3000);
    },
}