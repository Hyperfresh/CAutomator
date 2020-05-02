#the thing
import discord
from discord.ext import commands
from discord.utils import get

#the other thing
import os
from dotenv import load_dotenv
import csv

def read_cell(row, col): # Getting name of entry. Thanks @GradyDal on Repl.it
	with open('speeds.csv', 'r') as f:
		data=list(csv.reader(f))
		return(data[int(row)][int(col)])

testing = False
linecount = 0

bot = commands.Bot(command_prefix='-')

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

#the code
client = discord.Client()

@client.event
async def on_ready():
    await client.change_presence(activity=discord.Game(name='Splatoon 2 with Hy~'))
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    global testing
    global linecount
    if message.author == client.user:
        return

    if message.content.startswith('-about'):
        await message.channel.send(file=discord.File('cautomator.png'))
        await message.channel.send('> **Hello! I am CAutomator, the Calculated Anarchy Automator!**\nI am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh8080/CAutomator')

    if message.content.startswith('-help'):
        await message.channel.send("> **Help**\n `-speed`: See how fast my host's network is!\n `-abspeed`: Tells you some info about the `-speed` command.\n `-help`: This command!\n `-about`: Tells you some info about me!\n `-whoami`: Tells you who you are!")

    if message.content.startswith('-whoami'):
        await message.channel.send("You are " + str(message.author))

    if message.content.startswith('-shutdown'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':wave: > Control-C at the Web Server (hyperfresh.ddns.net), ' + str(message.author) + '!')
        else:
            await message.channel.send(':x: > Nice try, ' + str(message.author) + ". <:squinteyes:563998593460076544>")

    if message.content.startswith('-abspeed'):
        speedabout = '''**Speedtest CLI by Ookla** (speedtest.exe) is the official command line client for testing the speed and performance of an internet connection, provided by Ookla.
Your use of this command (speed) is subject to the Speedtest End User License Agreement, Terms of Use and Privacy Policy at these URLs:
        https://www.speedtest.net/about/eula
        https://www.speedtest.net/about/terms
        https://www.speedtest.net/about/privacy
        '''
        await message.channel.send(str(speedabout))


# ATT - The following code won't work unless you have Speedtest CLI installed somewhere
    if message.content.startswith('-speed'):
        speeder = open("inprocess.txt", 'r')
        for line in speeder:
            if 'Process' in line:
                speeder.close
                count = open('speeds.csv','r')
                lines = 0
                for line in count:
                    lines = lines + 1
                count.close
                if lines == linecount:
                    print('SPEED TEST REQUESTED BUT DENIED - IN PROCESS')
                    await message.channel.send("> :x: > **I'm still testing speed!**\n Please wait a bit longer.")
                else:
                    speeder.close
                    downspeed = int(read_cell(lines-1,5))
                    upspeed = int(read_cell(lines-1,6))
                    downspeed = float(downspeed/100000)
                    upspeed = float(upspeed/100000)
                    downspeed = round(downspeed,2)
                    upspeed = round(upspeed,2)
                    await message.channel.send('> :white_check_mark: > **Results**\nServer: **' + read_cell(lines-1, 0) + '**\nPing: **' + read_cell(lines-1,2) + " ms**\nDownload: **" + str(downspeed) + " Mbps**\nUpload: **" + str(upspeed) + " Mbps**\n\n*Conducted using Ookla's Speedtest CLI: https://speedtest.net\nSpeeds are converted from bits to megabits, and rounded to two decimal places.*")
                    speeder = open('inprocess.txt','w')
                    speeder.write('Idle')
                    speeder.close
            elif 'Idle' in line:
                linecount = 0
                speeder.close
                count = open('speeds.csv','r')
                lines = 0
                for line in count:
                    lines = lines + 1
                count.close
                linecount = lines
                await message.channel.send('> :bullettrain_side: > **Testing speed...**\nRun this command again in two minutes to see results!')
                print('SPEED TEST REQUESTED:')
                print(os.system('speed.cmd'))

client.run(TOKEN)