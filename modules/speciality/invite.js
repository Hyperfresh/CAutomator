const Discord = require('discord.js')

const talkedRecently = new Set();

var error;

function setError(type) {
    error = type
}

function createInv(message) {
    message.author.send('Sending you an invite into <:CalculatedAnarchy:584304539717599234>.\nPlease note that this expires after 24 hours, or as soon as the invite is used by someone: whichever comes first.')
    .then(i => {
        message.channel.createInvite({maxUses: 1},`This invite was created by ${message.author.tag}.`)
        .then(invite => {
            message.author.send(`Here's your requested invite link: ${invite}`)
            setError(true)
        })
        .catch(x => {
            message.author.send(`Apologies, but something happened while trying to create your invite. Please DM @Hy and they'll create the invite for you.`)
            setError(false)
        })
    })
    .catch(i => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Rather not open your DM\'s?')
            .setDescription('[Open a ticket with us instead.](https://discord.com/channels/267817764989698048/547334755885121536/769472963484844053)')
        message.reply('your DMs don\'t seem to be open. I\'m not able to create an invite without that, so please open your DMs and try again.',embed)
        setError(false)
    });
}

module.exports = {
    commands: 'invite',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        if (!(message.member._roles.includes('321506876632203264'))) {
            message.reply('only Level 10+ members can use this command.')
            return
        }
        if (talkedRecently.has(message.author.id)) {
            message.reply('please wait 24 hours before you create another invite.')
            return
        }
        message.reply('please wait while I create an invite.')
        createInv(message)
        setTimeout(() => {
            if (!error) return
            message.reply('please check your DMs.')
            talkedRecently.add(message.author.id)
            setTimeout(() => {
                talkedRecently.delete(message.author.id)
            }, 86400000);
        }, 3000)
    }
}