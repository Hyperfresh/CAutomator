#the thing
import discord
from discord.ext import commands
from discord.utils import get

#the other thing
import os
from dotenv import load_dotenv
import csv

def read_cell(row, col): # Getting name of entry. Thanks @GradyDal on Repl.it
	with open('database.csv', 'r') as f:
		data=list(csv.reader(f))
		return(data[int(row)][int(col)])

bot = commands.Bot(command_prefix='-')

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

#the code
client = discord.Client()


@client.event
async def on_ready():
    await client.change_presence(activity=discord.Game(name='uno with Hy~'))
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('-about'):
        await message.channel.send(file=discord.File('cautomator.png'))
        await message.channel.send('> **Hello! I am CAutomator, built by @Hyperfresh#8080.**\nThe Calculated Anarchy Automator! I am a bot tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh8080/CAutomator')
    
    if message.content.startswith('-ping'):
        lat = bot.latency
        await message.channel.send(':ping_pong: > ' + str(lat) + 'ms')

# ATT - The following code won't work unless you have Speedtest CLI installed somewhere
    if message.content.startswith('-speed'):
        await message.channel.send('My last recorded speed was...')

client.run(TOKEN)