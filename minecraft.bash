CHECK="NULL"
[ ps -fea|grep -i java =~ "/home/hyperfresh/Documents/Minecraft/server.jar" ] && CHECK="ON"
if [ "$CHECK" == "NULL" ]; then
bash mcstart.bash &
fi
echo "Done"
exit