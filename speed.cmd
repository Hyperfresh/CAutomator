echo Process > %cd%\inprocess.txt
start /b %cd%\speed\speedtest.exe --accept-license --selection-details --f csv > NUL >> %cd%\speeds.csv
