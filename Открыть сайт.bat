@echo off
cd /d "C:\Users\Azamat\Desktop\restaurant"

curl -s -o NUL -w "%%{http_code}" -L --max-time 3 http://localhost:3000 > "%TEMP%\_site_check.txt" 2>nul
set /p STATUS=<"%TEMP%\_site_check.txt"

if "%STATUS%"=="200" goto :open

echo Starting the site, please wait...
if not exist "_empty_stdin.txt" type nul > "_empty_stdin.txt"
powershell -NoProfile -WindowStyle Hidden -Command "Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList 'node_modules\next\dist\bin\next','dev' -WorkingDirectory 'C:\Users\Azamat\Desktop\restaurant' -WindowStyle Hidden -RedirectStandardInput 'C:\Users\Azamat\Desktop\restaurant\_empty_stdin.txt' -RedirectStandardOutput 'C:\Users\Azamat\Desktop\restaurant\_server.log' -RedirectStandardError 'C:\Users\Azamat\Desktop\restaurant\_server-err.log'"
timeout /t 12 /nobreak >nul

:open
start "" "http://localhost:3000"
