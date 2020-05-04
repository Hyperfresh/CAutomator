# About CAutomator
![CAutomator logo](/cautomator.png)
I am CAutomator, a bot specifically built for the Calculated Anarchy server to "automate all da things!".

Built using Python.

Use this at your will, just make sure you follow the MIT License.

# Setting up
You will need the following modules installed through `pip`:
- discord.py
- tinydb
- python_dotenv

Additionally, you will also need the `speedtest` CLI for `-speed` to work. You can download at https://www.speedtest.net/apps/cli

1. Clone this repository onto your machine, or download a ZIP.
 - If you're cloning: this setup assumes you're cloning onto your home/Documents/GitHub folder

**STEPS 2 AND 3 FOR WINDOWS USERS ONLY**

2. Create a separate folder (maybe in Documents), this setup will assume you made `CAuto` in Documents
3. Assuming you installed Python from python.org, create a CMD Batch (`start.cmd`) with the following code:
 `py %userprofile%\documents\github\cautomator\bot.py`
 Save the file in `CAuto`. You can create a link to this batch file in your computer's startup so it runs when you login - this will be at `%userprofile%\appdata\roaming\microsoft\windows\start menu\programs\startup`
 Please also copy the `CAutomator.png` to `CAuto`.

4. For `-speed` to work, download the `speedtest` CLI.
 - On Windows, place speedtest.exe in `CAuto`
 - On \*nix, place speedtest in your copy of CAutomator

5. Depending on your OS:
 - On Windows, create `speed.cmd` in `CAuto` with the following code:
 `echo Process > %cd%\inprocess.txt`
 `start /b %cd%\speed.exe --accept-license --selection-details --f csv > NUL >> %cd%\speeds.csv`
 - On \*nix, create `speed.sh` in your copy of CAutomator with the following code:
 `echo "Process" > inprocess.txt`
 `speedtest --accept-license --selection-details --f csv >> speeds.csv`
 Then in `bot.py`, at approximately line 121 (with code `print(os.system(speed.cmd)) # cmd sets as process`), change `speed.cmd` to `sh speed.sh`.

6. Create a .env file in your copy of CAutomator, with following code:
 `# .env`
 `DISCORD_TOKEN=<token>`
 where `<token>` is your bot token in discord developers.

7. Run `bot.py` - if you run into issues, please feel free to open an issue on this repository :)
