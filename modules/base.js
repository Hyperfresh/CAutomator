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
    for (permission of validPerms) {
        if (!validPerms.includes(permission)) {
            throw new Error(`Couldn't recognise permission "${permission}".`)
        }
    }
}

module.exports = (client, commandOptions) => {
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

    if (typeof commands === "string") commands = [commands];
    console.log(`Loaded ${commands[0]}`);
    if (perms.length) {
        if (typeof perms.length === "string") perms = [perms];
        validatePerm(perms);
    }

    client.on('message', function(message) {
        const {member, content, guild} = message
        for (let alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
                for (let permission of perms) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }
                for (let requiredRole of requiredRoles) {
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
    })
}