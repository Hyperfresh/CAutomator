const {exec} = require("child_process")

module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, args) => {
        if (args == "") message.channel.send(`> 🏓 > **Pong!**`);
        else {
            message.channel.send(`Pinging \`${args[0]}\`.`)
            const promise = new Promise((resolve, reject) => {
                exec(`ping ${args[0]} -t 4`, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Exec error: ${error.message}`)
                        message.channel.send(defaultErr)
                        return
                    }
                    if (stderr) {
                        reject(`Stderr error: ${stderr}`)
                        message.channel.send(defaultErr)
                        return
                    }
                    console.log(`Stdout output: ${stdout}`)
                    resolve(stdout)
                });
            })
            promise.then(res =>
                message.channel.send(`\`\`\`${res}\`\`\``)
            )
        }
    },
}