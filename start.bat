@echo off
REM Linux/DevOps Command Reference Guide - Startup Script

echo ========================================
echo  Command Reference Guide - Web App
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found!
echo.

REM Check if virtual environment exists
if exist venv (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

REM Install requirements
echo.
echo Installing/updating requirements...
pip install -q -r requirements.txt

REM Check if installation was successful
if errorlevel 1 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting Web Server...
echo ========================================
echo.
echo Opening in browser: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser
timeout /t 2 >nul
start http://localhost:5000

REM Start Flask
python app.py
