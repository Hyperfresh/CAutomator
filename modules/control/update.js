const config = require('../../data/config.json')
const {exec} = require('child_process');

module.exports = {
    commands: 'update',
    minArgs: 0,
    maxArgs: 1,
    perms: 'ADMINISTRATOR',
    callback: (message, args) => {
        let d = config.DIR
        if (args == "npm") message.channel.send(`> ⚠️ > **I sure hope you know what you are doing, <@${message.author.id}>.**\n- npm, on behalf of the bot owner`)
        else {
            message.channel.send(`> ℹ️ > <@${message.author.id}>, I'm going to assume you wanted to update the bot.\nIf that's not what you wanted, you probably forgot to add \`npm\`.`)
            args = ["bot"]
        }
        console.log(`${message.author.username}#${message.author.discriminator} requested to update ${args[0]}.`)
        message.channel.send(`🔄 Updating ${args[0]}...`);
        const promise = new Promise((resolve, reject) => {
            console.log(`Attempting to update ${args[0]}.`)
            exec(`pwsh -File ${d}/update.ps1 ${args[0]} > ${d}/data/update.log`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Exec error: ${error.message}`)
                    return
                }
                if (stderr) {
                    reject(`Stderr error: ${stderr}`)
                    return
                }
                console.log(`Stdout output: ${stdout}`)
                resolve()
            });
        })
        try {
            promise.then(res => {
                message.channel.send('Update complete. Remember to manually reboot this bot.', { files: [`${d}/data/update.log`]});
            }).catch(err => {
                console.warn(`Something really bad happened. ${err}`)
                message.channel.send(`> 🛑 > Something really bad happened.\nPlease report the following error to my bot owner: \`\`\`${err}\`\`\``)
                return
            });
        } catch(error) {
            console.warn(`Something really bad happened. ${error}`)
            message.channel.send(`> 🛑 > Something really bad happened.\nPlease report the following error to my bot owner: \`\`\`${error}\`\`\``)
            return
        }
    }
}