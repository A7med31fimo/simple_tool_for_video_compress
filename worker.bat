@echo off
REM Video Compression Worker - Windows
REM Continuously processes pending compression jobs

cd /d "%~dp0backend"

echo 🎬 Video Compression Worker Started
echo Processing pending jobs...
echo.

php artisan compression:process --watch
