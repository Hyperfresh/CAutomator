//        _
//   /\__| |__/\ 
//   \   ___   / __                 _                                     _
//  _/  /   \  \/  \              _| |_                                 _| |_
// |_  |     \ /    \     _   _  |_   _|  _____   _________   _____ _  |_   _|  _____   _____
//  _\  \_____/  /\  \   | | | |   | |   |  _  | |  _   _  | |  _  | |   | |   |  _  | |  ___|
//  \________/  /__\  \  | |_| |   | |   | |_| | | | | | | | | |_|   |   | |   | |_| | | |
//          /__/    \__\ |_____|   |_|   |_____| |_| |_| |_| |_____|_|   |_|   |_____| |_|

var info = String(`
CAutomator - the custom-built Discord bot, coded in discord.js / node.js / typescript
Copyright (C) 2021 Hyperfresh | https://github.com/Hyperfresh/CAutomator/

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

Some of the TypeScript you see in CAutomator comes from iwa's deprecated Q-Bot
discord bot. You can see my fork of the bot at https://github.com/hyperfresh/myu-bot.
There is no license for Q-Bot, so it's assumed that credit to the original author
(Pierre "iwa") is substantial enough. If this isn't the case, let me know!
`)

console.log(info)

if (!/^(v([1-9][2-9]+\.)?(\d+\.)?(\d+))$/.test(process.version)) { // Version check
        throw new Error(`CAutomator requires Node.js v12.*.* or higher to run properly. You have ${process}. Please upgrade your Node install.`)
}

import * as Discord from "discord.js";
import * as fs from 'fs';
const config = require("./data/config.json");
const bot: Discord.Client = new Discord.Client();
const commands: Discord.Collection<any, any> = new Discord.Collection();

import ready from './events/ready';

// Set up database.
import { MongoClient } from 'mongodb';
const url = config.MONGO_URL, dbName = config.MONGO_DBNAME;

// Imports commands from the 'commands' folder
fs.readdir('./modules/', { withFileTypes: true }, (error, f) => {
        if (error) return console.error(error);
        f.forEach((f) => {
                if (f.isDirectory()) {
                        fs.readdir(`./modules/${f.name}/`, (error, fi) => {
                                if (error) return console.error(error);
                                fi.forEach((fi) => {
                                        if (!fi.endsWith(".js")) return;
                                        let commande = require(`./modules/${f.name}/${fi}`);
                                        commands.set(commande.help.name, commande);
                                })
                        })
                } else {
                        if (!f.name.endsWith(".js")) return;
                        let commande = require(`./modules/${f.name}`);
                        commands.set(commande.help.name, commande);
                }
        });
});


// Process related Events
process.on('uncaughtException', exception => console.error(exception));

// Bot-User related Events
bot.on('warn', warning => { console.warn(`🟡 > ${warning}`) });
bot.on('shardError', error => { console.error(`💥 ERROR! > ${error}`) });
bot.on('shardDisconnect', () => console.warn("🟡 > Bot disconnected from shard."));
bot.on('shardReconnecting', () => console.log("🟡 > Attempting to reconnect..."));
bot.on('shardResume', async () => ready(bot));
bot.on('shardReady', async () => {
        ready(bot)
        console.log(`🟢 > Logged in as ${bot.user.username}.`);
});

bot.on('message', async (msg: Discord.Message) => {

        if (!msg || msg.author.bot || msg.channel.type != "text" || !msg.guild.available) return;

        let args = msg.content.slice(1).trim().split(/ +/g);
        let req = args.shift();
        let cmd: any = commands.get(req);

        let mongod = await MongoClient.connect(url, { 'useUnifiedTopology': true });
        let db = mongod.db(dbName);

        if (config.SLEEP === '1' && msg.author.id != config.MAINTAINERID) return;

        if (!cmd) return;
        else await cmd.run(bot, msg, args, db, commands);

});

import birthdayCheck from './loops/birthdayCheck';
setInterval(async () => {
        await birthdayCheck(bot)
}, 3600000);

bot.login(config.TOKEN);

export { url, dbName }