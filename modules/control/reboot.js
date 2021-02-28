const config = require('../../data/config.json');
let prefix = config.PREFIX

function ready(client) {
    var play = String(prefix+"help");
    client.user.setPresence({
            status: "online",activity:{
                    name:play,type:"PLAYING"
            }
    });
    console.log("🟩 >",client.user.tag,"is now online.");
}

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
                client.login(config.TOKEN);
                setTimeout(() => {
                        ready(client);
                }, 3000);
            }, 5000);
        }, 3000);
    },
}