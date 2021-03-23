const Parser = require('rss-parser')
const parser = new Parser();
const xml2js = require('xml2js')
const xmlparser = new xml2js.Parser();

const Discord = require('discord.js')

const { DateTime } = require('luxon')

function createAlertEmbed(result,num) {
    let alert = result.div.alert[num].info[0]
    let embed = Discord.MessageEmbed()
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
    }
    embed.setTitle(alert.area[0].areaDesc[0])

    let issued = DateTime.fromISO(alert.effective[0]).toLocaleString(DateTime.DATETIME_FULL)
    let expire
    embed.setDescription(`> **Issued ${issued}**\n${alert.description[0]}`)

    embed.addField('What you should do',alert.instruction[0])
}

module.exports = {
    commands: 'alert',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        let RSS_URL = 'https://hyperfresh.github.io/test.xml' // 'https://data.eso.sa.gov.au/prod/cfs/criimson/cfs_current_incidents.xml' // 'http://data.eso.sa.gov.au/prod/cfs/criimson/cfs_cap_incidents.xml'
        parser.parseURL(RSS_URL)
            .then(res => {
                console.log(res.items[0].content)
                console.log('parsing...')
                xmlparser.parseStringPromise(res.items[0].content).then(function (result) {
                    console.dir(result);
                    console.log('Done');
                })
                    .catch(function (err) {
                       // Failed
                    })
                if (res.items.length > 1) {
                    for ( let i = 0; i <= res.items.length; i++ ) {
                        console.log(res.items[i].content)
                        console.log('parsing...')
                        xmlparser.parseStringPromise(res.items[i].content).then(function (result) {
                            console.dir(result);
                            console.log('Done');
                        })
                            .catch(function (err) {
                            // Failed
                            });
                    }
                }
            })
        
    }
}