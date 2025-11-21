@echo off
REM Quick Python checker for Windows

echo ========================================
echo Python Installation Checker
echo ========================================
echo.

REM Check python command
echo Checking 'python' command...
python --version 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python found via 'python' command
    python --version
) else (
    echo [FAIL] 'python' command not working
)
echo.

REM Check python3 command
echo Checking 'python3' command...
python3 --version 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python found via 'python3' command
    python3 --version
) else (
    echo [FAIL] 'python3' command not working
)
echo.

REM Check py launcher
echo Checking 'py' launcher...
py --version 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python found via 'py' launcher
    py --version
) else (
    echo [FAIL] 'py' launcher not working
)
echo.

echo ========================================
echo PATH Analysis
echo ========================================
echo Current PATH:
echo %PATH%
echo.

echo ========================================
echo Recommendations
echo ========================================
echo.
echo If no Python was found above:
echo 1. Download Python from: https://www.python.org/downloads/
echo 2. Run installer
echo 3. CHECK "Add Python to PATH" during installation
echo 4. Restart your terminal
echo.
echo If "Microsoft Store" message appears:
echo 1. Open Settings ^> Apps ^> App execution aliases
echo 2. Turn OFF "App Installer" for python.exe and python3.exe
echo 3. Install Python from python.org
echo.

pause
