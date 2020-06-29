CHECK="NULL"
[ ps -fea|grep -i java =~ "/home/hyperfresh/Documents/Minecraft" ] && CHECK="ON"
if [ "$CHECK" == "NULL" ]; then
./mcstart.bash &
fi
echo "Done"
exit