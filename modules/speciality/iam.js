
const fail = function() {
    message.reply('something went wrong. Please try that again.')
}

module.exports = {
    commands: 'im',
    requiredRoles: ['Level 1+'],
    minArgs: 1,
    maxArgs: 2,
    callback: (message, args) => {
        let member = message.guild.member(message.author.id)
        if (args[0] == "horny") {
            if (member._roles.includes('743044688633790474')) { // member has banned role
                message.reply('you are currently banned you from the NSFW category.\nAsk an Admin for assistance.')
            } else if (member._roles.includes('697338555533361194')) { // member already has role
                message.reply("there's no need to tell me multiple times that you're horny. *(You already have this role)*")
            } else {
                member.roles.add('697338555533361194')
                    .then(message.reply('you now have access to the NSFW category. *Please*, do not lewd the octopus.'))
                    .catch(fail)
            }
        } else if (args[0] == "tasted") {
            if (member._roles.includes('524424268503580683')) { // member already has role
                message.reply("I'm sure your tastes are good, unlike some people. *(You already have this role)*")
            } else if (member._roles.includes('712628726671867975')) { // member has banned role
                message.reply('you are cuurently banned from using music commands.\nAsk an Admin for assistance.')
            } else {
                member._roles.add('524424268503580683')
                    .then(message.reply('you now have access to music commands.'))
                    .catch(message.reply('something went wrong. Please try that again.'))
            }
        } else if (args[0] == 'not') { // Remove role.
            if (args[1] == 'horny' && member._roles.includes('697338555533361194')) {
                member.roles.remove('697338555533361194')
                    .then(message.reply('you are no longer horny. Welcome to the bright side.'))
                    .catch(fail)
            } else if (args[1] == 'tasted' && member._roles.includes('524424268503580683')) {
                member.roles.remove('524424268503580683')
                    .then(message.reply('you no longer have access to music commands.'))
                    .catch(fail)
            } else {
                message.reply("either you don't have the role, or you've provided an incorrect argument. Check both before tyring again.")
            }
        }
    }
}