let breakMessages = [
    'oh no you have broken me!',
    'Oh no, hairpins busted',
    "'JHsfhishi28778878v...'''s''df'4'4'433'101011011001'",
    "oh no, now my brain has turned into mash potat",
    "Have a break, have a Kit Kat."
]

import { Client, Message } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message) => {
    let item = Math.random() * (breakMessages.length - 1)
    msg.channel.send(`${breakMessages[item.toFixed(0)]}`)
}

module.exports.help = {
    name: "break",
    usage: "break",
    desc: "lili what did you do this time"
}