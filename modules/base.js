const { prefix } = require('../data/config.json');

const validatePerm = (permission) => {
    const validPerms = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMJOIS',
    ]
    for (permission of permissions) {
        if (!validPerms.includes(permission)) {
            throw new Error(`Couldn't recognise permission "${permission}".`)
        }
    }
}

module.export = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Sorry, you can\'t do that.',
        minArgs = 0,
        maxArgs = null,
        perms = [],
        requiredRoles = [],
        callback
    } = commandOptions;
};

if (typeof commands === "string") {
    let commands = [commands];
}
if (permissions.length) {
    if (typeof permissions === "string") {
        let permissions = [permissions];
    }
    validatePerm(permissions);
}

client.on('message', function(message) {
    const {member, content, guild} = message
    for (alias of commands) {
        if (content.toLowerCase().startswith(`${prefix}${alias.toLowerCase()}`)) {
            for (permission of permissions) {
                if (!member.hasPermission(permission)) {
                    message.reply(permissionError)
                    return
                }
            }
            for(requiredRole of requiredRoles) {
                let role = guild.roles.cache.find(role => role.name === requiredRole)
                if (!role || !member.roles.cache.has(role.id)) {
                    message.reply(`Seems you don't have the **${requiredRole}** role.`)
                    return
                }
            }
            const arguments = content.split(/[ ]+/)
            arguments.shift()
            if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
                message.reply(`Looks like you messed up your command somewhere.`)
                return
            }
            callback(message, arguments, arguments.join(' '))
            return
        }
    }
}
});