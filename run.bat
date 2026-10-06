@echo off
echo ========================================================
echo  Starting OfflineMind - Local AI Knowledge ^& Study Assistant
echo ========================================================
echo.
echo Mode: 100%% LOCAL (Zero Cloud Dependency)
echo Checking network status...
echo Localhost ports:
echo  - Frontend / Fullstack App: http://localhost:3000
echo  - (Optional) Python Backend: http://localhost:8000
echo.

if exist ".venv\Scripts\activate.bat" (
    echo Activating Python virtual environment...
    call .venv\Scripts\activate.bat
    echo Starting Python backend in background...
    start "OfflineMind Python Backend" /min uvicorn backend.main:app --host 127.0.0.1 --port 8000
)

echo Starting OfflineMind Web Application on port 3000...
start "" "http://localhost:3000"
npm run dev
pause
