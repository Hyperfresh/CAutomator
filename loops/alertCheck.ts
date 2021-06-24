/**
 * CFS Alert Check function
 * @packageDocumentation
 * @module AlertCheck
 * @category Loops
 */

import { Client, MessageEmbed } from 'discord.js';
import Parser from 'rss-parser';
import xml2js from 'xml2js'
import { DateTime } from 'luxon'
const parser = new Parser()
const xmlparser = new xml2js.Parser()
const config = require('../data/config.json')

function createAlertEmbed(result, num) {
    let alert = result.div.alert[num].info[0]
    let embed = new MessageEmbed()
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
    let issued = DateTime.fromISO(alert.effective[0]).setZone('Australia/Adelaide').toLocaleString(DateTime.DATETIME_MED)
    let expire = DateTime.fromISO(alert.expires[0]).setZone('Australia/Adelaide').toLocaleString(DateTime.DATETIME_MED)
    embed.setDescription(`> **Issued ${issued}**\n\n${alert.description[0]}`)
    embed.addField('What you should do', `${alert.instruction[0]}\n\n> **Expires ${expire}**`)
    embed.setFooter('Times are in Australian Central Standard/Daylight')
    return embed
}

/**
 * Every 15 minutes, it checks if an alert has been issued
 * by the South Australian Country Fire Service. If so, an
 * alert embed message is sent with the relevant information.
 * @param bot - Discord Client object
 */

 export default async function alertCheck(bot: Client) {
    let guild = bot.guilds.cache.find(val => val.id == config.GUILDID)
    let RSS_URL = 'https://data.eso.sa.gov.au/prod/cfs/criimson/cfs_cap_incidents.xml'
    parser.parseURL(RSS_URL)
        .then(res => {
            try {
                console.log('🔵 > There is an active CFS warning. First warning as follows:',res.items[0].content)
            } catch {
                console.log('No alerts to show.')
                return
            }
            let channel: any = guild.channels.cache.find(val => val.id == process.env.BIRTHDAYTC)
            if (res.items.length > 1) {
                for (let i = 0; i <= res.items.length; i++) {
                    console.log('🔵 > Parsing a warning...')
                    xmlparser.parseStringPromise(res.items[i].content).then(function (result) {
                        console.dir(result);
                        channel.send(createAlertEmbed(result, i))
                    })
                }
            }
        })
        
 }