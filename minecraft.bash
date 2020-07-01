CHECK="NULL"
[ ps -fea|grep -i java =~ "/home/hyperfresh/CA-Minecraft-Server/server.jar" ] && CHECK="ON"
if [ "$CHECK" == "NULL" ]; then
bash mcstart.bash &
fi
echo "Done"
exit