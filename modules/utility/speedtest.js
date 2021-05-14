/*
                   !!! DISCLAIMER !!!
The speedtest module uses Ookla's Speedtest API and CLI app,
located at https://speedtest.net, in the form of an NPM module.

Usage of this module means you agree to Ookla's EULA, Privacy
Policy, Terms of Use and GPDR DPA, accessible below:
- EULA: https://www.speedtest.net/about/eula
- Terms of Use: https://www.speedtest.net/about/terms
- GDPR DPA https://www.speedtest.net/gdpr-dpa
- Privacy Policy https://www.speedtest.net/about/privacy

The NPM module in question is licensed under the MIT License.
*/

const speedTest = require('speedtest-net');
const discord = require('discord.js')
var run = false

module.exports = { // Command
    commands: 'speed',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        if (!run) {
            run = true
            message.reply('Conducting speed test. Please wait.')
            speedTest({acceptLicense: true}).then(res => {
                console.log(res)
                let download = res.download.bytes/1000000
                let upload = res.upload.bytes/1000000

                let embed = new discord.MessageEmbed()
                    .setAuthor('Speedtest by Ookla',null,'https://speedtest.net')
                    .setThumbnail('https://www.speedtest.net/s/images/ookla/index/gauge-blue-1x.png')
                    .setTitle('Speedtest Results')
                    .setURL(res.result.url)
                    .setDescription(`**Download speed**: ${download.toFixed(2)} Mbps\n**Upload speed**: ${upload.toFixed(2)} Mbps\n**Ping**: ${res.ping.latency}ms`)
                    .addField('Server',`**${res.server.name}**@${res.server.location}, ${res.server.country}`)
                    .addField('Disclaimers',"This command is powered by [Ookla's Speedtest](https://speedtest.net).\nUsage of this command means you agree to Ookla's [EULA](https://www.speedtest.net/about/eula), [Terms of Use](https://www.speedtest.net/about/terms), [GDPR DPA](https://www.speedtest.net/gdpr-dpa) and [Privacy Policy](https://www.speedtest.net/about/privacy).")
                    .setTimestamp(res.timestamp)

                message.channel.send(embed)
            })
        }
    }
}

