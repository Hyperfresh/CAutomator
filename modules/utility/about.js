module.exports = {
    commands: 'about',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, text) => {
        message.channel.send(`https://github.com/Hyperfresh/CAutomator/blob/dev/resources/logo.png?raw=true`);
        message.channel.send(`CAutomator is a custom-built bot for this server. Learn more at http://github.com/hyperfresh/CAutomator.`);
    },
}