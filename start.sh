#!/bin/bash

# Linux/DevOps Command Reference Guide - Startup Script

echo "========================================"
echo " Command Reference Guide - Web App"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python3 using your package manager"
    exit 1
fi

echo "Python found: $(python3 --version)"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo ""
echo "Installing/updating requirements..."
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install requirements"
    exit 1
fi

echo ""
echo "========================================"
echo " Starting Web Server..."
echo "========================================"
echo ""
echo "Opening in browser: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser (Linux/Mac)
if command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open http://localhost:5000
elif command -v open &> /dev/null; then
    sleep 2
    open http://localhost:5000
fi

# Start Flask
python3 app.py
