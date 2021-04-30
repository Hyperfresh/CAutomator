// RSS Parsing
const Parser = require('rss-parser')
const parser = function() { Parser(); }
const xml2js = require('xml2js')
const xmlparser = new xml2js.Parser();

// Embed building
const Discord = require('discord.js')

// ISO timestamp to human readable
const { DateTime } = require('luxon')

// Create alert embed
function createAlertEmbed(result,num) {
    let alert = result.div.alert[num].info[0]
    let embed = new Discord.MessageEmbed()
        .setAuthor(alert.parameter[2].value[0].toUpperCase())
    if (alert.parameter[2].value[0] == 'Bushfire Advice') {
        embed.setThumbnail('https://github.com/Hyperfresh/CAutomator/blob/dev/resources/alert-symbols/ico-fire-yellow.png?raw=true')
        embed.setColor(16506930)
    } else if (alert.parameter[2].value[0] == 'Bushfire Watch and Act') {
        embed.setThumbnail('https://github.com/Hyperfresh/CAutomator/blob/dev/resources/alert-symbols/ico-fire-orange.png?raw=true')
        embed.setColor(16742656)
    } else if (alert.parameter[2].value[0] == 'Bushfire Emergency Warning') {
        embed.setThumbnail('https://github.com/Hyperfresh/CAutomator/blob/dev/resources/alert-symbols/ico-fire-red.png?raw=true')
        embed.setColor(14024732)
    } else if (alert.parameter[2].value[0] == 'Update') {
        embed.setThumbnail('')
            .setColor(16777215)
    }
    embed.setTitle(alert.area[0].areaDesc[0])
    embed.setURL(alert.web[0])
    let issued = DateTime.fromISO(alert.effective[0]).toLocaleString(DateTime.DATETIME_MED)
    let expire = DateTime.fromISO(alert.expires[0]).toLocaleString(DateTime.DATETIME_MED)
    embed.setDescription(`> **Issued ${issued}**\n\n${alert.description[0]}`)
    embed.addField('What you should do',`${alert.instruction[0]}\n\n> **Expires ${expire}**`)
    embed.setFooter('Times are in Australian Central Standard/Daylight')
    return embed
}

module.exports = {
    commands: 'alert',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        let RSS_URL = 'https://data.eso.sa.gov.au/prod/cfs/criimson/cfs_cap_incidents.xml'
        parser.parseURL(RSS_URL)
            .then(res => {
                try {
                    console.log(res.items[0].content)
                } catch {
                    message.channel.send('No alerts to show.')
                    return
                }
                console.log('parsing...')
                xmlparser.parseStringPromise(res.items[0].content).then(function (result) {
                    console.dir(result);
                    message.channel.send(createAlertEmbed(result,0))
                })
                if (res.items.length > 1) {
                    for ( let i = 0; i <= res.items.length; i++ ) {
                        console.log(res.items[i].content)
                        console.log('parsing...')
                        xmlparser.parseStringPromise(res.items[i].content).then(function (result) {
                            console.dir(result);
                            message.channel.send(createAlertEmbed(result,i))
                        })
                    }
                }
            })
        
    }
}