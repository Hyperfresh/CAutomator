#        _
#   /\__| |__/\ 
#   \   ___   / __                 _                                     _
#  _/  /   \  \/  \              _| |_                                 _| |_
# |_  |     \ /    \     _   _  |_   _|  _____   _________   _____ _  |_   _|  _____   _____
#  _\  \_____/  /\  \   | | | |   | |   |  _  | |  _   _  | |  _  | |   | |   |  _  | |  ___|
#  \________/  /__\  \  | |_| |   | |   | |_| | | | | | | | | |_|   |   | |   | |_| | | |
#          /__/    \__\ |_____|   |_|   |_____| |_| |_| |_| |_____|_|   |_|   |_____| |_|

info = """
CAutomator - the custom-built Discord bot, coded in Python
Copyright (C) 2020 Hyperfresh | https://github.com/Hyperfresh/CAutomator/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.
"""
print(info)
print("importing core")
##########################################
# IMPORTS, DEFINITIONS AND DECLARATIONS

# IMPORT | discord.py modules
import discord
from discord.ext import commands
from discord.utils import get

# IMPORT | tinydb and query modules for custom roles, including regular expression (regex)
from tinydb import TinyDB, Query
import re

# IMPORT | other modules
import platform # for os info
import os #dotenv and os info
import sys # for restarting the bot
import imgkit # for converting webpage to image
from random import choice

# IMPORT | subprocessing, allowing CAutomator to do multiple things at once
import asyncio
from concurrent.futures import ThreadPoolExecutor
import subprocess

print("loading dotenv")
# IMPORT, START | dotenv
from dotenv import load_dotenv #dotenv thing which has discord token
load_dotenv() # loads the dotenv

# IMPORT | time
import time
import datetime

print("declaring special variables")
# DECLARATIONS | special things
db = TinyDB('db.json') # declare database exists
pf = TinyDB('pf.json') # Profiles
TOKEN = os.getenv('DISCORD_TOKEN') # declare the bot token. CHECK YOUR .env FILE!
lvl30ID = 547360918930194443 # the ID for the level 30 role
fwiends = 741919152587145277
bot = commands.Bot(command_prefix='-') # declare the prefix
client = discord.Client() # stuff

print("declaring other variables")
# DECLARATIONS | types, just declare what type the variable is.
# if boolean, assume False
# if integer, assume 0
CurrentTime = ""
SpeedPerformTime = ""
results = {} # dictionary {}
testing = False
convert = ""
downloading = False
upload = [] # array []
ytdl_options = []
getbom = False
notbom = False
totalmess = 0
location = ""
messerr = ""
linecount = 0
devswitch = 0
someoneDisable = False
theGameEP = int(time.time())
theGameD = (time.strftime("%d %b %Y %H:%M:%S", time.localtime()))
# integer "devswitch" ranges from 0 to 2 to switch the type of dev email fetching.
# 0 = for i in range(messages, messages-N, -1)
# 1 = for i in range(N)
# 2 = while mess != N

print("defining exit")
# DEFINITIONS | closes the program (yeah, not intuitive.)
def crashcrash():
    exit()
    crashcrash()

print("defining time")
# IMPORT, DEF | get the current time, or record the time a speedtest was done.
def UpdateTime(speed):
    global CurrentTime
    global SpeedPerformTime
    CurrentTime = (time.strftime("%d %b %Y %H:%M:%S", time.localtime()))
    if speed == True: # record this as the time the speedtest was done
        SpeedPerformTime = CurrentTime

print("defining speed")
# IMPORT, DEF | test speed of host using Ookla's Speedtest CLI via pypi.
import speedtest
def TestSpeed():
    global results
    UpdateTime(True)
    s = speedtest.Speedtest()
    s.get_best_server()
    s.download(threads=None)
    s.upload(threads=None)
    s.results.share()
    results = s.results.dict()

print("defining ytdl")
# IMPORT, DEF | download things off youtube.
# THIS REQUIRES youtube-dl INSTALLED (on the command prompt, not pypi)
import glob
def ytdl():
    global upload
    global ytdl_options

    dltype = str(ytdl_options[1])
    video = str(ytdl_options[0])

    os.system('rm -rf ~/CAutomator/yt-pl') # remove playlist folder
    os.system('rm ~/CAutomator/output.*') # remove outputs, if existent
    if dltype == "list":
        print("converting list to mp3 zips")
        subprocess.run(['youtube-dl','-x','-o','~/CAutomator/yt-pl/%(title)s.%(ext)s',str(video)])  
        print("zipping")
        subprocess.run(['zip','-r','~/CAutomator/output.zip','-i',"~/CAutomator/yt-pl/"])
        print("complete")

    elif dltype == "aud":
        print("downloading to mp3")
        subprocess.run(['youtube-dl',
        '--no-playlist',
        '-x','--audio-format','mp3',
        '-o','~/CAutomator/output.%(ext)s',
        str(video)])
        print("complete")
        upload = glob.glob('/home/hyperfresh/CAutomator/output.*')

    else: # assume mp4 if anything else
        print("downloading to mp4")
        subprocess.run(['youtube-dl',
        '--no-playlist',
        '-o','~/CAutomator/output.%(ext)s',
        str(video)])
        print("complete")
        upload = glob.glob('/home/hyperfresh/CAutomator/output.*')

print("defining conv")
# DEFINITIONS | convert to mp3/mp4.
# THIS REQUIRES HandBrakeCLI AND ffmpeg INSTALLED (via apt)
def conv():
    global upload
    global ytdl_options

    dltype = str(ytdl_options[1])
    
    os.system('rm ~/CAutomator/compress.mp4 ~/CAutomator/audio.mp3')
    if dltype == "aud":
        print("converting to mp3")
        subprocess.run(['ffmpeg',
        '-i',str(upload[0]),
        '-map','0:a:0','-b:a','96k',
        '/home/hyperfresh/CAutomator/audio.mp3'])
        print("completed")
    else:
        print("compressing")
        subprocess.run(['HandBrakeCLI',
        '-Z',"Discord Tiny 5 Minutes 240p30",
        '-i',str(upload[0]),
        '-o','/home/hyperfresh/CAutomator/compress.mp4'])
        print("completed")

print("defining wttr")
# DEFINITIONS | get the weather, either from BOM or wttr.in
def wttr():
    global location
    global getbom
    global notbom
    print("getting weather")

    au_cities = ['adelaide','perth','sydney','darwin','canberra','melbourne','brisbane','hobart']
    au_states = ['sa','wa','nsw','nt','act','vic','qld','tas']
    notbom = False

    if getbom == True:
        if location in au_cities:
            print("au location detected")
            forecast = au_cities.index(location)
            imgkit.from_url('http://bom.gov.au/'+str(au_states[forecast])+'/forecasts/'+str(au_cities[forecast])+'.shtml', 'weather.png')
            print("got results from bom")
        elif location in au_states:
            print("au location detected")
            forecast = au_states.index(location)
            imgkit.from_url('http://bom.gov.au/'+str(au_states[forecast])+'/forecasts/'+str(au_cities[forecast])+'.shtml', 'weather.png')
            print("got results from bom")
        else:
            notbom = True
        return

    subprocess.run(['curl','wttr.in/'+str(location)+'.png','--output','weather.png'])
    print("completed")

# DEFINITIONS | get a minecraft skin
print("defining mcskin")
def MCSkin(user,var):
    subprocess.run(['curl','https://minotar.net/'+str(var)+'/'+str(user)+'.png','--output','skin.png'])

# DEFINITIONS | read a log
print("defining readlog")
def readlog(logfile):
    logmessage = """"""
    log = open(logfile,'r')
    for line in log:
        logmessage = logmessage + line + """\n"""
    log.close
    return(logmessage)

    print("trying")
    subprocess.run(['bash','minecraft.bash'])
    print("completed")


    global totalmess
    global messerr
    global devswitch

    os.system('rm ~/CAutomator/out*.*')

    messerr = ""
    USER = os.getenv('IMAP_USERNAME') # CHECK YOUR .env FILE!!!
    PASS = os.getenv('IMAP_PASSWORD')
    imap = imaplib.IMAP4_SSL("outlook.office365.com")
    imap.login(USER, PASS)
    status, messages = imap.select("GetDev")

    # total number of emails
    N = int(count)
    messages = int(messages[0])
    totalmess = messages
    mess = 0

    try:
        if devswitch == 0:
            for i in range(messages-4, messages-N-4, -1):
                mess = mess + 1
                res, msg = imap.fetch(str(i), "(RFC822)")

                os.system('rm ~/CAutomator/out'+str(mess)+'.txt')
                os.system('rm ~/CAutomator/out'+str(mess)+'.png')
                os.system('rm ~/CAutomator/out'+str(mess)+'.html')
                writeto = open("out"+str(mess)+".txt",'a+')

                for response in msg:
                    if isinstance(response, tuple):
                        # parse a bytes email into a message object
                        msg = email.message_from_bytes(response[1])
                        # decode the email subject
                        subject = decode_header(msg["Subject"])[0][0]
                        if isinstance(subject, bytes):
                            # if it's a bytes, decode to str
                            subject = subject.decode()
                        # email sender
                        from_ = msg.get("From")
                        writeto.write("Subject: "+str(subject)+"\nFrom: "+str(from_)+"\n\n")
                        # if the email message is multipart
                        if msg.is_multipart():
                            # iterate over email parts
                            for part in msg.walk():
                                # extract content type of email
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                try:
                                    # get the email body
                                    body = part.get_payload(decode=True).decode()
                                except:
                                    pass
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    # print text/plain emails and skip attachments
                                    writeto.write(body)
                                elif "attachment" in content_disposition:
                                    # download attachment
                                    filename = part.get_filename()
                                    if filename:
                                        if not os.path.isdir(subject):
                                            # make a folder for this email (named after the subject)
                                            os.mkdir(subject)
                                        filepath = os.path.join(subject, filename)
                                        # download attachment and save it
                                        open(filepath, "wb").write(part.get_payload(decode=True))
                        else:
                            # extract content type of email
                            content_type = msg.get_content_type()
                            # get the email body
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            if content_type == "text/plain":
                                # print only text email parts
                                writeto.write(body)
                        if content_type == "text/html":
                            # if it's HTML, create a new HTML file and open it in browser
                            if isinstance(subject, bytes):
                                # if it's a bytes, decode to str
                                subject = subject.decode()
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            filename = "out"+str(mess)+".html"
                            filepath = os.path.join(filename)
                            # write the file
                            open(filepath, "w").write(body)
                            imgkit.from_file(filepath, 'out'+str(mess)+'.png')
                        writeto.close()
        elif devswitch == 1:
            for i in range(N):
                mess = mess + 1
                res, msg = imap.fetch(str(i), "(RFC822)")

                os.system('rm ~/CAutomator/out'+str(mess)+'.txt')
                os.system('rm ~/CAutomator/out'+str(mess)+'.png')
                os.system('rm ~/CAutomator/out'+str(mess)+'.html')
                writeto = open("out"+str(mess)+".txt",'a+')

                for response in msg:
                    if isinstance(response, tuple):
                        # parse a bytes email into a message object
                        msg = email.message_from_bytes(response[1])
                        # decode the email subject
                        subject = decode_header(msg["Subject"])[0][0]
                        if isinstance(subject, bytes):
                            # if it's a bytes, decode to str
                            subject = subject.decode()
                        # email sender
                        from_ = msg.get("From")
                        writeto.write("Subject: "+str(subject)+"\nFrom: "+str(from_)+"\n\n")
                        # if the email message is multipart
                        if msg.is_multipart():
                            # iterate over email parts
                            for part in msg.walk():
                                # extract content type of email
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                try:
                                    # get the email body
                                    body = part.get_payload(decode=True).decode()
                                except:
                                    pass
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    # print text/plain emails and skip attachments
                                    writeto.write(body)
                                elif "attachment" in content_disposition:
                                    # download attachment
                                    filename = part.get_filename()
                                    if filename:
                                        if not os.path.isdir(subject):
                                            # make a folder for this email (named after the subject)
                                            os.mkdir(subject)
                                        filepath = os.path.join(subject, filename)
                                        # download attachment and save it
                                        open(filepath, "wb").write(part.get_payload(decode=True))
                        else:
                            # extract content type of email
                            content_type = msg.get_content_type()
                            # get the email body
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            if content_type == "text/plain":
                                # print only text email parts
                                writeto.write(body)
                        if content_type == "text/html":
                            # if it's HTML, create a new HTML file and open it in browser
                            if isinstance(subject, bytes):
                                # if it's a bytes, decode to str
                                subject = subject.decode()
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            filename = "out"+str(mess)+".html"
                            filepath = os.path.join(filename)
                            # write the file
                            open(filepath, "w").write(body)
                            imgkit.from_file(filepath, 'out'+str(mess)+'.png')
                        writeto.close()
        else:
            while mess != N:
                mess = mess + 1
                res, msg = imap.fetch(str(mess), "(RFC822)")

                os.system('rm ~/CAutomator/out'+str(mess)+'.txt')
                os.system('rm ~/CAutomator/out'+str(mess)+'.png')
                os.system('rm ~/CAutomator/out'+str(mess)+'.html')
                writeto = open("out"+str(mess)+".txt",'a+')

                for response in msg:
                    if isinstance(response, tuple):
                        # parse a bytes email into a message object
                        msg = email.message_from_bytes(response[1])
                        # decode the email subject
                        subject = decode_header(msg["Subject"])[0][0]
                        if isinstance(subject, bytes):
                            # if it's a bytes, decode to str
                            subject = subject.decode()
                        # email sender
                        from_ = msg.get("From")
                        writeto.write("Subject: "+str(subject)+"\nFrom: "+str(from_)+"\n\n")
                        # if the email message is multipart
                        if msg.is_multipart():
                            # iterate over email parts
                            for part in msg.walk():
                                # extract content type of email
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                try:
                                    # get the email body
                                    body = part.get_payload(decode=True).decode()
                                except:
                                    pass
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    # print text/plain emails and skip attachments
                                    writeto.write(body)
                                elif "attachment" in content_disposition:
                                    # download attachment
                                    filename = part.get_filename()
                                    if filename:
                                        if not os.path.isdir(subject):
                                            # make a folder for this email (named after the subject)
                                            os.mkdir(subject)
                                        filepath = os.path.join(subject, filename)
                                        # download attachment and save it
                                        open(filepath, "wb").write(part.get_payload(decode=True))
                        else:
                            # extract content type of email
                            content_type = msg.get_content_type()
                            # get the email body
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            if content_type == "text/plain":
                                # print only text email parts
                                writeto.write(body)
                        if content_type == "text/html":
                            # if it's HTML, create a new HTML file and open it in browser
                            if isinstance(subject, bytes):
                                # if it's a bytes, decode to str
                                subject = subject.decode()
                            try:
                                body = msg.get_payload(decode=True).decode()
                            except:
                                pass
                            filename = "out"+str(mess)+".html"
                            filepath = os.path.join(filename)
                            # write the file
                            open(filepath, "w").write(body)
                            imgkit.from_file(filepath, 'out'+str(mess)+'.png')
                        writeto.close()
    except Exception as e:
        messerr = str(e)
    imap.close()
    imap.logout()

    return count

UpdateTime(True)

print("attempting to start...")
@client.event
async def on_ready():
    
    await client.change_presence(activity=discord.Game(name='-?'))
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    global someoneDisable
    global theGameEP
    global theGameD
    if message.author.bot: return #avoid every bot instead of only itself

    if(not message.content.startswith('-')):
        theString = message.content.lower
        if "@someone" in message.content or "<@&742301786198769714>" in message.content:
            if someoneDisable == True: await message.channel.send("This feature is disabled.")
            else:
                user = choice(message.channel.guild.members)
                while "295463016248377344" in str(user.roles):
                    user = choice(message.channel.guild.members)
                await message.channel.send("I pick **"+str(user.mention)+"**!")
        else: return

    args = message.content.split()
    args.pop(0) # removes the command from arguments

######################################################
# ABOUT MODULE
#
    if message.content.startswith('-about'):
        await message.channel.send(file=discord.File('resources/logo.png'))
        await message.channel.send('> :wave: > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\nI am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh/CAutomator\n Also, thanks to https://github.com/iwa for some errands :)')

######################################################
# HELP MODULE now redirects to the bot's wiki on commands
#
    if message.content.startswith('-help') or message.content.startswith('-?'):
        await message.channel.send("> :information_source: > **Check here**\nhttps://github.com/Hyperfresh/CAutomator/wiki/Commands")

######################################################
# SHUTDOWN MODULE
#
    if message.content.startswith('-stop'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':wave: > See ya, ' + str(message.author) + '!')
            await client.change_presence(activity=None,status=discord.Status.offline)
            crashcrash()
        else:
            await message.channel.send(':x: > Nice try, ' + str(message.author) + ". <:squinteyes:563998593460076544>")

######################################################
# SPEEDTEST MODULE
#
    global SpeedPerformTime
    global results
    global testing

    if message.content.startswith('-speed'):
        if testing == False: # so that there aren't multiple speedtests
            testing = True
            await message.add_reaction('<a:Typing:459588536841011202>') # react to message and indicate bot is working on it
            loop = asyncio.get_event_loop() # yep, subprocessing
            await loop.run_in_executor(ThreadPoolExecutor(), TestSpeed)
            downspeed = float((results['download'])/1000000) # convert the results down to mbps (instead of true bits)
            upspeed = float((results['upload'])/1000000)
            downspeed = round(downspeed,2) # then round
            upspeed = round(upspeed,2)
            await message.channel.send('> :white_check_mark: > **Results**\nPerformed: **' + str(SpeedPerformTime) + '** (South Australia Time)\nServer: **' + str(results['server']['sponsor']) + " " + str(results['server']['name'])  + '**\nPing: **' + str(results['ping']) + " ms**\nDownload: **" + str(downspeed) + " Mbps**\nUpload: **" + str(upspeed) + " Mbps**\n\n*Conducted using Ookla's Speedtest CLI: https://speedtest.net\nSpeeds are converted from bits to megabits, and rounded to two decimal places.*")
            await message.clear_reactions()
            await message.add_reaction('✅') # react to message indicating done
            testing = False
        else:
            await message.add_reaction('❌') # react to message if already doing speedtest


######################################################
# CUSTOM ROLE MODULE
#
# Thanks to https://github.com/iwa for helping me out with this module :)

    global lvl30ID
    global fwiends # used for -role and -delrole

    if message.content.startswith('-role'): # assign or edit role
        member = message.author
        #print("user has: " + str(member.roles))
        if (str(lvl30ID) in str(member.roles)) or (str(fwiends) in str(member.roles)): # check if the member has level 30 role
            User = Query()
            result = db.search(User.memberId == member.id)

            if(len(result) == 1): # edit exisiting role
                roleName = ""
                for x in range(0, len(args)-1):
                    roleName = roleName + args[x] + " "

                hexColorMatch = re.search(r'^#(?:[0-9a-fA-F]{3}){1,2}$', args[len(args)-1]) # check if hex can be parsed

                if hexColorMatch:
                    roleColour = discord.Colour(int(args[len(args)-1][1:], 16))
                    print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                    role = message.guild.get_role(result[0]['roleId'])
                    print(role)
                    await role.edit(name=roleName, colour=roleColour)
                    await member.add_roles(role)
                    await message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
                else:
                    print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' without colour change')
                    role = message.guild.get_role(result[0]['roleId'])
                    roleName = roleName + args[len(args)-1]
                    await role.edit(name=roleName)
                    await member.add_roles(role)
                    await message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
            else: # assign new role
                roleName = ""
                for x in range(0, len(args)-1):
                    roleName = roleName + args[x] + " "

                hexColorMatch = re.search(r'^#(?:[0-9a-fA-F]{3}){1,2}$', args[len(args)-1]) # check if hex can be parsed

                if hexColorMatch:
                    roleColour = discord.Colour(int(args[len(args)-1][1:], 16))
                    print('ROLE CREATE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                    role = await message.guild.create_role(name=roleName, colour=roleColour)
                    await member.add_roles(role)
                    db.insert({'memberId': member.id, 'roleId': role.id})
                    await message.channel.send("> :white_check_mark: > **Role given**\n<@{0}>, I gave you the role **<@&{1}>**".format(message.author.id, role.id))
                else:
                    await message.channel.send("> :x: > **Something went wrong**\n <@{.author.id}>, the colour hex code you entered is incorrect!\nDid you forget the `#` at the start of your hex code?".format(message))
        else:
            await message.channel.send("> :x: > **You can't do that**\nThis is for Level 30+ use only.")

    if message.content.startswith('-delrole'):
        member = message.author
        if (str(lvl30ID) in str(member.roles)) or (str(fwiends) in str(member.roles)): # check if the member has level 30 role

            User = Query()
            result = db.search(User.memberId == member.id)

            if(len(result) == 1):

                print('ROLE DELETION REQUESTED for ' + member.name + "#" + member.discriminator)

                role = message.guild.get_role(result[0]['roleId'])
                await member.remove_roles(role)
                await message.channel.send("> :white_check_mark: > **Role removed**\n<@{0}>, I removed your custom role.\nDo `-role` to create a new custom role".format(member.id))
            else:
                await message.channel.send("> :x: > **You can't do that**\n<@{0}>, you don't have any custom role!".format(member.id))
        else:
            await message.channel.send("> :x: > **You can't do that**\nThis is for Level 30+ use only.")

######################################################
# PING DISCORD MODULE
#
    if message.content.startswith('-ping'):
        if len(args) == 1:

            tpb = ['pirate','thepiratebay.org','piratebay','proxybay','proxy','bay','isis','isil']

            if str(args[0]) in tpb: # if it's in the list, don't do it.
                await message.channel.send("> :x: **You can't do that**\nDue to ISP Terms and Conditions, you cannot ping this website.")
                return
            await message.add_reaction('<a:Typing:459588536841011202>')
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            separator = " "
            pingme = separator.join(args)
            os.system('ping -c 4 ' + str(pingme) + ' > ping.txt')
        if len(args) == 0:
            await message.channel.send('> :ping_pong: > **Pong!** I recorded ' + str(bot.latency) + ' ms.')
            return
        await message.channel.send('```' + str(readlog('ping.txt')) + '```')
        await message.clear_reactions()
        await client.change_presence(activity=discord.Game('-?'))

    global CurrentTime

    if message.content.startswith('-time'):
        UpdateTime(False)
        await message.channel.send('It is **' + str(CurrentTime) + '**, South Australia Time.')

######################################################
# GET OS MODULE
#      
    if message.content.startswith('-os'):
            await message.channel.send('I am running on **' + str(os.name) + " " + str(platform.system()) + " " + str(platform.release()) + '**.')

######################################################
# UPDATE MODULE
#
    if message.content.startswith('-update'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send('<a:Typing:459588536841011202> > Updating...')
            await client.change_presence(activity=discord.Game('Updating...'),status=discord.Status.idle)
            os.system('bash update.bash > update.log') # fetch and pull boys. fetch and pull.
            await message.channel.send('```' + str(readlog('update.log')) + '```')
            time.sleep(3)
            await message.channel.send(':red_circle: > Restarting...')
            await client.change_presence(activity=discord.Game('Restarting...'),status=discord.Status.dnd)
            time.sleep(3)
            os.execl(sys.executable, sys.executable, * sys.argv)
        else:
            await message.channel.send(':x: > Only the bot author can do this.')
            
######################################################
# RESTART MODULE
#           
    if message.content.startswith('-rb'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':red_circle: > Restarting...')
            await client.change_presence(activity=discord.Game('Restarting...'),status=discord.Status.dnd)
            print('Preparing to restart...')
            time.sleep(3)
            print('Restarting...')
            os.execl(sys.executable, sys.executable, * sys.argv)
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# SHELL MODULE
#
    if message.content.startswith('-sh'):
        if str(message.author) == 'Hyperfresh#8080':
            separator = " "
            code = separator.join(args)
            await message.add_reaction('<a:Typing:459588536841011202>')
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            os.system('rm ~/CAutomator/test.sh')
            testfile = open('test.sh','w')
            testfile.write(str(code))
            testfile.close()
            print(os.system('sh test.sh > sh.log'))
            try:
                await message.channel.send('```' + str(readlog('sh.log')) + '```')
            except Exception as e:
                await message.channel.send(':x: > Something went wrong when sending the output of the command here. Did it hit the 2000 character limit?\nError:```' + str(e) + "```Here's a copy of what was output:")
                await message.channel.send(file=discord.File('sh.log'))
            await client.change_presence(activity=discord.Game('-?'))
            await message.clear_reactions()
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# FILE-RETR MODULE
#

    if message.content.startswith('-file'):
        if str(message.author) == 'Hyperfresh#8080':
            if len(args) > 1:
                await message.channel.send(":x: > More than one argument was provided.")
            else:
                await message.add_reaction('<a:Typing:459588536841011202>')
                try:
                    await message.channel.send(file=discord.File(str(args[0])))
                except Exception as e:
                    await message.channel.send(":x: > An error occurred when sending this file.\n```" + str(e) + "```")
                await message.clear_reactions()
        else:
            await message.channel.send(':x: > Only the bot author can do this.')


    if message.content.startswith('-ps'):
        if str(message.author) == 'Hyperfresh#8080':
            separator = " "
            code = separator.join(args)
            await message.add_reaction('<a:Typing:459588536841011202>')
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            try:
                os.system('powershell -c "' + str(code) + '" > code.log')
                try:
                    await message.channel.send('```powershell\n' + str(readlog('code.log')) + '```')
                except Exception as e:
                    await message.channel.send(':x: > Something went wrong when sending the output of the command here. Did it hit the 2000 character limit?\nError:```' + str(e) + "```Here's a copy of what was output:")
                    await message.channel.send(file=discord.File('code.log'))
            except Exception as e:
                await message.channel.send(":x: > That didn't work.\n\nCode: ```" + str(code) + '```\nError:```' + str(e) + "```")
            await client.change_presence(activity=discord.Game('-?'))
            await message.clear_reactions()
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# WEATHER MODULE
#
    global location
    global getbom
    global notbom

    if message.content.startswith('-weather'):
        if len(args) == 0:
            await message.channel.send(":x: > You didn't specify a location.")
        else:
            await message.add_reaction('<a:Typing:459588536841011202>')
            separator = "%20"
            location = separator.join(args)
            loop = asyncio.get_event_loop()
            getbom = False
            if str(args[-1]) == "-bom":
                getbom = True
                location = str(args[0])
                await message.add_reaction('📡')
            await loop.run_in_executor(ThreadPoolExecutor(), wttr)
            if notbom == True:
                await message.channel.send(":x: > This isn't a location where I can get weather from BOM.")
                return
            try:
                await message.channel.send(file=discord.File('weather.png'))
            except Exception as e:
                await message.channel.send(":x: > Can't get weather. Is http://wttr.in out of queries?\n\nError: ```" + str(e) + "```")
            await message.clear_reactions()

######################################################
# YTDL MODULE
#
    global upload
    global downloading
    global ytdl_options
    global convert

    if message.content.startswith('-ytdl'): # -ytdl <video> <mp4/mp3>
        if downloading == True: await message.add_reaction('❌')
        if len(args) > 2: await message.add_reaction('⚠️')
        else:
            downloading = True
            if len(args) == 1: args = [str(args[0]), "mp3"]
            if("list" in str(args[0]) and "watch" not in str(args[0])):
                await message.add_reaction('<a:Typing:459588536841011202>')
                await message.add_reaction('🗒')
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'list']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                await message.add_reaction('📤')
                await message.channel.send("Downloaded playlist. Uploading to Discord...")
                try:
                    await message.channel.send(file=discord.File('output.zip'))
                except Exception as e:
                    await message.channel.send(":x: > Upload failed. The ZIP might be too big to upload here.\n\nError: ```" + str(e) + "```")
                await client.change_presence(activity=discord.Game(name='-?'))
                downloading = False
            elif str(args[1]) == "mp3":
                await message.add_reaction('<a:Typing:459588536841011202>')
                await message.add_reaction('🎵')
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'aud']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                await message.add_reaction('📤')
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                print("attempting to upload")
                try:
                    print("upload")
                    await message.channel.send(file=discord.File('output.mp3'))
                    print("done")
                except Exception as e:
                    print("fail")
                    await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")
                    print("done")
                await client.change_presence(activity=discord.Game(name='-?'))
                downloading = False
            else:
                await message.add_reaction('<a:Typing:459588536841011202>')
                await message.add_reaction('🎬')
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'vid']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                await message.add_reaction('🗜')
                await client.change_presence(activity=discord.Game(name='Compressing...'))
                await loop.run_in_executor(ThreadPoolExecutor(), conv)
                await message.add_reaction('📤')
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                try:
                    await message.channel.send(file=discord.File('compress.mp4'))
                except Exception as e:
                    await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")
                await client.change_presence(activity=discord.Game(name='-?'))
                downloading = False
            await message.clear_reactions()
            await message.add_reaction('✅')

    global totalmess
    global messerr
    global devswitch
    methods = ['0 for i in range(messages, messages-N, -1)','1 for i in range(N)','2 while mess != N']

    if message.content.startswith('-getdevcom'):
        if len(args) != 1:
            await message.channel.send(":x: > Too few or too many arguments provided.")
            return
        try:
            print(int(args[0]))
        except:
            await message.channel.send(":x: > Not a number.")
            return
        await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
        await message.channel.send("ℹ️ > You asked me to read **"+str(args[0])+" emails.**\n:warning: > ||`"+str(methods[devswitch])+"`||\n<a:Typing:459588536841011202> > Please wait while I check the inbox.")
        loop = 0
        try:
            tries = int(readmail(args[0]))
        except Exception as e:
            await message.channel.send(":x: > An error occured. The command might've timed out? ```"+str(e)+"```")
            return
        if messerr != "":
            await message.channel.send(":x: > An error occured. ```" + str(messerr) + "```")
            return
        if tries > totalmess:
            tries = totalmess
        await message.channel.send("📬 > I found **"+str(tries)+" emails** to read from the **"+str(totalmess)+" total emails** in the inbox.")
        while loop != tries:
            loop = loop + 1
            #await message.channel.send("📤 Uploading **email "+str(loop)+"**.")
            await client.change_presence(activity=discord.Game(name='Uploading email '+str(loop)+'...'))
            try:
                await message.channel.send(file=discord.File('out'+str(loop)+'.png'))
            except Exception as e:
                await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")
        await message.channel.send("✅ > Done.")
        await client.change_presence(activity=discord.Game(name='-?'))
    
    # Switch email method
    b = []

    if message.content.startswith('-devswitch'):
        if str(message.author) == 'Hyperfresh#8080':
            if len(args) > 1:
                b = [x for i,x in enumerate(methods) if i!=devswitch]
                await message.channel.send('> ⚙️ > **Current settings:**\n```diff\n+ Enabled:\n'+str(methods[devswitch])+'\n- Disabled:\n'+str(b[0])+'\n'+str(b[1])+'\n```')
            else:
                if len(args) == 0:
                    b = [x for i,x in enumerate(methods) if i!=devswitch]
                    await message.channel.send('> ⚙️ > **Current settings:**\n```diff\n+ Enabled:\n'+str(methods[devswitch])+'\n- Disabled:\n'+str(b[0])+'\n'+str(b[1])+'\n```')
                else:
                    try:
                        test = int(args[0])
                    except:
                        await message.add_reaction('⚠️')
                        return
                    if 0 <= test <= 2:
                        devswitch = test
                        b = [x for i,x in enumerate(methods) if i!=devswitch]
                        await message.channel.send('> ✅ > **Settings changed.** Here are the new settings:\n```diff\n+ Enabled:\n'+str(methods[devswitch])+'\n- Disabled:\n'+str(b[0])+'\n'+str(b[1])+'\n```')
                    else:
                        await message.add_reaction('⚠️')
                        return
        else:
            await message.channel.send('> ⚙️ > **Current settings:**\n```diff\n+ Enabled:\n'+str(methods[devswitch])+'\n- Disabled:\n'+str(b[0])+'\n'+str(b[1])+'\n```This command shows you the current mail fetch method for the `-getdevcom` command.\n> :warning: > __Information is for debugging only.__\nTo change the fetch method, please contact Hyperfresh.')

######################################################
# MINECRAFT SKIN MODULE
#
    if message.content.startswith('-mcskin'): # -mcskin user type
        user = ""
        var = ""
        try:
            if len(args) == 2:
                if str(args[1]) == "body":
                    var = "armor/body"
                    await message.add_reaction('🧍‍♂️')
                elif str(args[1]) == "avatar":
                    var = "helm"
                    await message.add_reaction('🙂')
                elif str(args[1]) == "head":
                    var = "cube"
                    await message.add_reaction('👦')
                elif str(args[1]) == "bust":
                    var = "armor/bust"
                    await message.add_reaction('👤')
                elif str(args[1]) == "skin" or "helm" or "cube":
                    var = str(args[1])
                    if str(args[1]) == "skin":
                        await message.add_reaction('🖼')
                    elif str(args[1]) == "helm":
                        await message.add_reaction('🙂')
                    else:
                        await message.add_reaction('👦')
                else:
                    var = "helm"
                    await message.add_reaction('🙂')
            else:
                var = "helm"
                await message.add_reaction('🙂')
            user = str(args[0])
        except Exception as e:
            print("whoops, something went wrong")
            print(e)
        if user == "":
            await message.channel.send("> :x: > **That didn't work**\nEither you:\n - provided too many or few arguments\n - or didn't provide a username")
            return
        await message.add_reaction('<a:Typing:459588536841011202>')
        MCSkin(user,var)
        await message.clear_reactions()
        try:
            await message.channel.send(file=discord.File('skin.png'))
        except Exception as e:
            await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")    

    if message.content.startswith('-someone'):
        if someoneDisable == True: await message.channel.send("This feature is disabled.")
        else:
            user = choice(message.channel.guild.members)
            while "295463016248377344" in str(user.roles):
                user = choice(message.channel.guild.members)
            await message.channel.send("I pick **"+str(user)+"**!")

    if message.content.startswith('-disomeone'):
        if "295459816468381697" in str(message.author.roles):
            if someoneDisable == True: someoneDisable = False
            else: someoneDisable = True
            await message.channel.send(str(someoneDisable))
        else: await message.channel.send(str(someoneDisable))

    if message.content.startswith('-spoilers'):
        print("I heard spoilers!")
        member = message.author
        if (message.channel.id != 507466333496147978):
            await message.channel.send("<@{0}>, please run this command in <#507466333496147978>.".format(member.id))
            print("Never mind.")
            return
        role = message.guild.get_role(758604551787118603)
        if "758604551787118603" in str(message.author.roles):
            print("Person has role. Removing!")
            await member.remove_roles(role)
            await message.channel.send("> 🔒 **You were locked out.**\n<@{0}>, you can **no longer** read the message history of #spoilers.\nYou need to relaunch Discord for this to take effect.".format(member.id))
        elif len(args) > 1: await message.add_reaction('⚠️')
        elif len(args) == 1:
            if args[0] == "show":
                print("Adding!")
                await member.add_roles(role)
                await message.channel.send("> 🔓 **You were let in.**\n<@{0}>, you can **now** read the message history of #spoilers.\nYou need to relaunch Discord for this to take effect.".format(member.id))
            elif args[0] == "hide":
                print("Removing!")
                await member.remove_roles(role)
                await message.channel.send("> 🔒 **You were locked out.**\n<@{0}>, you can **no longer** read the message history of #spoilers.\nYou need to relauch Discord for this to take effect.".format(member.id))
            else: await message.add_reaction('⚠️') 
            return
        else:
            print("Instructions printed.")
            await message.channel.send("> :warning: **Spoilers ahead!**\n<@{0}>, if you want to see the message history of this channel, please enter `-spoilers show`.".format(member.id))

######################################################
# PROFILE MODULE
#
    if message.content.startswith("-profile"):
        member = message.author
        if len(args) != 0:
            if args[0] == "register":
                User = Query()
                result = pf.search(User.memberID == member.id)
                if len(result) != 1:
                    # check assigned pronouns via roles, make it easier
                    pronoun = []
                    if ("754901377406337085" in str(member.roles)): pronoun.append("he/him")
                    if ("754901568624525372" in str(member.roles)): pronoun.append("she/her")
                    if ("754901688669700106" in str(member.roles)): pronoun.append("they/them")
                    if ("754901986205237358" in str(member.roles)): pronoun.append("other")
                    try: # any pronouns?
                        pronouns = pronoun[0]
                    except: # if not, assign some first!
                        await message.channel.send("Please assign yourself a pronoun. You can do this here: https://discord.com/channels/267817764989698048/723112022425731093/760706868657520730")
                        return
                    if len(pronoun) > 1: # more than one pronoun?
                        pronouns = ""
                        for item in pronoun:
                            pronouns = item + ", " + pronouns
                            
                    pf.insert({ # insert into database
                        'memberID': member.id,
                        "disc": "{0}#{1}".format(member.name,member.discriminator),
                        "name": "Anonymous",
                        "bday": "--",
                        "switch": "None",
                        "pronouns": pronouns,
                        "bioT": None,
                        "bioD": None,
                        "colour": 0,
                        "avatar": str(member.avatar_url)
                    })
                    User = Query()
                    result = pf.search(User.memberID == member.id)
                    embed = discord.Embed( # build profile card from database
                        title=str(result[0]["disc"]),
                        colour=discord.Colour(result[0]["colour"]),
                        description="""
**Name**: {0}
**Pronouns**: {1}
**Birthday**: {2}
**Switch FC**: {3}
""".format(result[0]["name"],result[0]["pronouns"],result[0]["bday"],result[0]["switch"]),
                    )
                    embed.set_thumbnail(url=result[0]["avatar"])
                    embed.set_author(name="Calculated Anarchy Profile", icon_url="https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png")
                    # send built card
                    await message.channel.send(message="All set up! Here's what your profile looks like:",embed=embed)
                    # what can be edited
                    await message.channel.send("""To edit your profile, do `-profile edit`. Here's what you can edit:
```md
name - edit IRL name. eg, *Paul "Hy" Asencion* (but you do it how you want to do it.)
pronouns - (cannot be edited, they're given based on the roles you have)
bday - edit birthday, in the format *12 August*
fc - edit Switch friend code. eg, *SW-6873-6407-1599*
color - set colour of the card, in the format *#00ff00*. **#hex required**
bio - set a quick about yourself section, in the format *Bio Title | Description*. **`|` required**
```""")
                else:
                    await message.channel.send("You're already registered on the database!")
            elif args[0] == "edit":
                    User = Query()
                    result = pf.search(User.memberID == member.id)
                    if len(result) == 1:
                        if args[1] == "name":
                            name = ""
                            for i in range(2, len(args)):
                                name = name + args[i] + " "
                            pf.update({"name": name}, (User.memberID == member.id))
                            await message.channel.send("Updated **{0}**.".format(args[1]))
                        elif args[1] == "bday":
                            if len(args) != 4:
                                await message.channel.send("Check your birthdate. Make sure it's in the format \"12 August\"")
                            else:
                                pf.update({"bday": "{0} {1}".format(args[2],args[3])}, (User.memberID == member.id))
                                await message.channel.send("Updated **{0}**.".format(args[1]))
                        elif args[1] == "fc":
                            pf.update({"switch": str(args[2])}, (User.memberID == member.id))
                            await message.channel.send("Updated **{0}**.".format(args[1]))
                        elif args[1] == "bio":
                            text = ""
                            for i in range(2, len(args)):
                                if args[i] == "|":
                                    title = text
                                    text = ""
                                else:
                                    text = text + args[i] + " "
                            pf.update({"bioT": title, "bioD": text}, (User.memberID == member.id))
                            await message.channel.send("Updated **{0}**.".format(args[1]))  
                        elif args[1] == "color":
                            hexColorMatch = re.search(r'^#(?:[0-9a-fA-F]{3}){1,2}$', args[len(args)-1]) # check if hex can be parsed
                            if hexColorMatch:
                                pf.update({"colour": int(args[len(args)-1][1:], 16)}, (User.memberID == member.id))
                                await message.channel.send("Updated **{0}**.".format(args[1])) 
                            else: await message.channel.send("Check the colour you gave me. Is it right?")
                        elif args[1] == "update":
                            pronoun = []
                            if ("754901377406337085" in str(member.roles)): pronoun.append("he/him")
                            if ("754901568624525372" in str(member.roles)): pronoun.append("she/her")
                            if ("754901688669700106" in str(member.roles)): pronoun.append("they/them")
                            if ("754901986205237358" in str(member.roles)): pronoun.append("other")
                            try: # any pronouns?
                                pronouns = pronoun[0]
                            except: # if not, assign some first!
                                await message.channel.send("Please assign yourself a pronoun. You can do this here: https://discord.com/channels/267817764989698048/723112022425731093/760706868657520730")
                                return
                            if len(pronoun) > 1: # more than one pronoun?
                                pronouns = ""
                                for item in pronoun:
                                    pronouns = item + ", " + pronouns
                            pf.update({"avatar": str(member.avatar_url), "disc": "{0}#{1}".format(member.name,member.discriminator), "pronouns": pronouns}, (User.memberID == member.id))
                            await message.channel.send("Updated Discord details.")
                        else:    
                            await message.channel.send("Can't edit, did you mis-spell?")
                    else:
                        await message.channel.send("Couldn't find you in the database. Did you register?")
            elif args[0] == "help":
                await message.channel.send("""**Register**: `-profile register`\n**Your profile**: `-profile`\n**Another profile**: `-profile Hyperfresh#8080`\n**Edit**:`-profile edit`. Here's what you can edit:
```md
name - edit IRL name. eg, *Paul "Hy" Asencion* (but you do it how you want to do it.)
pronouns - (cannot be edited, they're given based on the roles you have)
bday - edit birthday, in the format *12 August*
fc - edit Switch friend code. eg, *SW-6873-6407-1599*
color - set colour of the card, in the format *#00ff00*. **#hex required**
bio - set a quick about yourself section, in the format *Bio Title | Description*. **`|` required**
```To update avatar, pronouns or Discord details, do `-profile edit update`.""")
                return
            else:
                User = Query()
                result = pf.search(User.disc == args[0])
                if len(result) == 1:
                    embed = discord.Embed(
                        title=str(result[0]["disc"]),
                        colour=discord.Colour(result[0]["colour"]),
                        description="""**Name**: {0}
                        **Pronouns**: {1}
                        **Birthday**: {2}
                        **Switch FC**: {3}""".format(result[0]["name"],result[0]["pronouns"],result[0]["bday"],result[0]["switch"]),
                    )
                    embed.set_thumbnail(url=result[0]["avatar"])
                    embed.set_author(name="Calculated Anarchy Profile", icon_url="https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png")
                    if result[0]["bioT"] != None:
                        embed.add_field(name=result[0]["bioT"], value=result[0]["bioD"])
                        await message.channel.send(embed=embed)
                else: await message.channel.send("Seems **{0}** isn't on the database.".format(args[0]))
        else:
            User = Query()
            result = result = pf.search(User.memberID == member.id)
            if len(result) == 1:
                embed = discord.Embed(
                    title=str(result[0]["disc"]),
                    colour=discord.Colour(result[0]["colour"]),
                    description="""**Name**: {0}
                    **Pronouns**: {1}
                    **Birthday**: {2}
                    **Switch FC**: {3}""".format(result[0]["name"],result[0]["pronouns"],result[0]["bday"],result[0]["switch"]),
                )
                embed.set_thumbnail(url=result[0]["avatar"])
                embed.set_author(name="Calculated Anarchy Profile", icon_url="https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png")
                if result[0]["bioT"] != None:
                    embed.add_field(name=result[0]["bioT"], value=result[0]["bioD"])
                await message.channel.send(embed=embed)
            else: await message.channel.send("Seems you aren't on the database. Run `-profile register` to do that!")
        
    if message.content.startswith("-namelist"):
        if str(message.author) != "Hyperfresh#8080": return
        for item in pf:
            embed = discord.Embed(
                title=str(item["disc"]),
                colour=discord.Colour(item["colour"]),
                description="""**Name**: {0}
                **Pronouns**: {1}
                **Birthday**: {2}
                **Switch FC**: {3}""".format(item["name"],item["pronouns"],item["bday"],item["switch"]),
            )
            embed.set_thumbnail(url=item["avatar"])
            embed.set_author(name="Calculated Anarchy Profile", icon_url="https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png")
            if item["bioT"] != None:
                embed.add_field(name=item["bioT"], value=item["bioD"])
            await message.channel.send(embed=embed)

client.run(TOKEN) # the thing that runs it all
