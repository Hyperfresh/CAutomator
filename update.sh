if [ $1 == 'npm' ]
then
    echo "[sh] > Checking install."
    npm ci
    echo "[sh] > Auditing."
    npm audit fix
elif [ $1 == 'bot' ]
then
    echo "[sh] > Fetching."
    git fetch --all
    echo "[sh] > Pulling."
    git pull
else
    echo "[sh] > I didn't expect argument \"$1\". I won't do anything, just in case."
fi
echo "[sh] > Done."