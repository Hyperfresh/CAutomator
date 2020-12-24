/* 
                        PLEASE READ THIS FIRST.

    This command provides a user with the latest commit of CAutomator
    as seen on https://github.com/hyperfresh/CAutomator, as well as
    zipping ALL FILES WITHIN THIS BOT (if it has changed since cloning)
    and providing it to the user in a private DM.

    As stated in Chapter 13 in the AGPL, which CAutomator is licensed on, you are to
    provide users with the source code if you have modified the code. This command
    allows that to happen by providing both the original source code, and your modified
    source code if available, complying with this requirement.

    UNLESS you have read the LICENSE file, and you know what you're doing, you should
    NOT MODIFY this command. Leave this file alone to comply with AGPL requirements.

                    READ THE ABOVE BEFORE PROCEEDING.
*/
var shell = require('shelljs');
module.exports = {
    commands: 'source',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        console.log(message.author, 'requested your source code.')
        message.reply('please check your DMs.')
        message.channel.send(`This bot is built on CAutomator. The latest source code is available at http://github.com/hyperfresh/CAutomator (the CAutomator GitHub).`);
        message.channel.send(`As CAutomator is licensed under the GNU Affero General Public License (which you can view at https://www.gnu.org/licenses/agpl-3.0.html), you may also see the source code of THIS bot if it has been modified since the latest commit on the CAutomator GitHub.`);
        message.channel.send(`I will DM you a zip of my source code shortly.`)
        if (!shell.which('zip')) {
            console.warn('Please install "zip" so I can provide the source code and comply with AGPL.')
            message.channel.send('Unfortunately, I can\'t provide the source code at the moment. Please DM the bot owner instead to retrieve a copy.')
            return
        }
        shell.zip('-r','source-code.zip','../../','../../data','-x','../../data/*','../../node_modules','../../.vscode')

    },
}