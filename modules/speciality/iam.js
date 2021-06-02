
const fail = function () {
    message.reply('something went wrong. Please try that again.')
}

function validate(member, id) {
    if (!(member._roles.includes(id))) {
        message.reply("either you already don't have the role, or you've provided an incorrect argument. Check both before tyring again.")
        return false
    }
    return true
}

function remove(member, args) {
    switch (args) {
        case "horny":
            if (!validate(member, '697338555533361194')) return
            member.roles.remove('697338555533361194')
                .then(message.reply('you are no longer horny. Welcome to the bright side.'))
                .catch(fail)
            break
        case "tasted":
            if (!validate(member, '524424268503580683')) return
            member.roles.remove(member, '524424268503580683')
                .then(message.reply('you no longer have access to music commands.'))
                .catch(fail)
            break
        case "spoilt":
            if (!validate(member, '758604551787118603')) return
            member.roles.remove('758604551787118603')
                .then(message.reply('you no longer have access to spoilers.'))
                .catch(fail)
            break
        default:
            message.reply("either you already don't have the role, or you've provided an incorrect argument. Check both before tyring again.")
    }
}

module.exports = {
    commands: 'im',
    requiredRoles: ['Level 1+'],
    minArgs: 1,
    maxArgs: 2,
    callback: (message, args) => {
        let member = message.guild.member(message.author.id)
        switch (args[0]) {
            case "spoilt":
                if (member._roles.includes('758604551787118603')) {
                    message.reply('you already have access to this channel.')
                    return
                }
                member.roles.add('758604551787118603')
                    .then(message.reply('you now have access to spoilers. Refresh your Discord app to apply changes.'))
                    .catch(fail)
                break
            case 'horny':
                if (member._roles.includes('743044688633790474')) { // member has banned role
                    message.reply('you are currently banned from the NSFW category.\nAsk an Admin for assistance.')
                } else if (member._roles.includes('697338555533361194')) { // member already has role
                    message.reply("there's no need to tell me multiple times that you're horny, I get it. *(You already have this role)*")
                } else {
                    member.roles.add('697338555533361194')
                        .then(message.reply('you now have access to the NSFW category. *Please*, do not lewd the octopus.'))
                        .catch(fail)
                }
                break
            case 'tasted':
                if (member._roles.includes('524424268503580683')) { // member already has role
                    message.reply("I'm sure your tastes are good, unlike some people. *(You already have this role)*")
                } else if (member._roles.includes('712628726671867975')) { // member has banned role
                    message.reply('you are currently banned from using music commands.\nAsk an Admin for assistance.')
                } else {
                    member._roles.add('524424268503580683')
                        .then(message.reply('you now have access to music commands.'))
                        .catch(fail)
                }
                break
            case 'not':
                remove(member, args[1])
                break
            default:
                message.reply('this doesn\'t look like a valid argument.\nAvailable arguments: `horny`, `tasted`, `not horny`, `not tasted`')
        }
    }
}