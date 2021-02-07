const talkedRecently = new Set();

async function createInv(message) {
    let invite = await message.channel.createInvite({maxUses: 1},`This invite was created by ${message.author.tag}.`)
    message.author.send(invite ? `Here's an invite into <:CalculatedAnarchy:584304539717599234>: ${invite}\nPlease note that this expires after 24 hours, or as soon as the invite is used by someone: whichever comes first.` : `Apologies, but something happened while trying to create your invite. Please DM @Hy and they'll create the invite for you.`)
}

module.exports = {
    commands: 'invite',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, args) => {
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
        message.reply('please check your DMs.')
        talkedRecently.add(message.author.id)
        setTimeout(() => {
            talkedRecently.delete(message.author.id)
        }, 86400000);
    }
}