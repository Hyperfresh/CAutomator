module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, args, text) => {
        message.channel.send(`> 🏓 > **Pong!**`);
    },
}