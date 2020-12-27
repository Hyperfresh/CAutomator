#                        PLEASE READ THIS FIRST.
#
#    This shell script is a dependency of the 'source' command located in
#    './modules/utility/provide-source-code.js'. This command provides a
#    user with the latest commit of CAutomator as seen on:
#
#                   https://github.com/hyperfresh/CAutomator
# 
#    as well as zipping ALL FILES WITHIN THIS BOT (if it has changed since
#    cloning) and providing it to the user in a private DM.
#
#    As stated in Chapter 13 in the AGPL, which CAutomator is licensed on,
#    you are to provide users with the source code if you have modified the
#    code. This allows that to happen by providing both the original source
#    code, and your modified source code if available, complying with this
#    requirement.

#    UNLESS you have read the LICENSE file, and you know what you're doing,
#    you should NOT MODIFY the code below, or the 'provide-source-code.js'
#    file. Leave this file alone to comply with AGPL requirements.
#
#                    READ THE ABOVE BEFORE PROCEEDING.
echo "Pushd to $1"
pushd $1
echo "Zipping $1 to \"$2_$3_source.zip\"."
echo "> To change file name, edit the \"name\" or \"version\" in your \"package.json\" file."
zip -r "./data/$2_$3_source.zip" "./" -x "./node_modules*" "./data*" "./.vscode*" "./.git*"
echo "Zipping complete. Popd from $1"
popd
echo "Done."