let breakMessages = [
    'oh no you have broken me!',
    'Oh no, hairpins busted',
    "'JHsfhishi28778878v...'''s''df'4'4'433'101011011001'",
    "oh no, now my brain has turned into mash potat"
    "Have a break, have a Kit Kat."
]

module.exports = {
    commands: 'break',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        let item = Math.random() * 3
        message.channel.send(`${breakMessages[item.toFixed(0)]}`)
    }
}
