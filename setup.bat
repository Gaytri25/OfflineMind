@echo off
echo ========================================================
echo  OfflineMind - Local AI Knowledge ^& Study Assistant Setup
echo ========================================================
echo.
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.10+ from https://python.org and ensure "Add to PATH" is checked.
    pause
    exit /b 1
)
echo Python detected successfully.
echo.

echo [2/4] Setting up Python virtual environment (.venv)...
if not exist ".venv" (
    python -m venv .venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)
call .venv\Scripts\activate
echo.

echo [3/4] Installing Python dependencies (Local RAG ^& Backend)...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

echo [4/4] Setting up Node.js UI dependencies...
call npm install
if errorlevel 1 (
    echo [WARNING] npm install had warnings, continuing...
)

echo.
echo ========================================================
echo  Setup Complete!
echo  Next steps:
echo   1. (Optional) Run Ollama or place a GGUF model in models\
echo   2. Double click "run.bat" to start OfflineMind
echo ========================================================
pause
