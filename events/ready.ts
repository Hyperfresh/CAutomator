/**
 * 'Ready' function executed every times the bot logs in
 * @packageDocumentation
 * @module ReadyFunction
 * @category Events
 */
 import { Client } from 'discord.js';

 export default async function ready(bot: Client) {
    await bot.user.setActivity("-help",).catch(console.error);
    await bot.user.setStatus("online").catch(console.error);
 }