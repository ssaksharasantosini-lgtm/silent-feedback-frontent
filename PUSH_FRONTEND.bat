@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\makar\Desktop\frontend-cct"

echo.
echo ========================================
echo  Pushing Frontend to GitHub
echo ========================================
echo.

echo [1/3] Adding all files...
git add .

echo [2/3] Creating commit...
git commit -m "Silent Feedback System - Frontend"

echo [3/3] Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  Complete!
echo ========================================
echo.
echo Check: https://github.com/ssaksharasantosini-lgtm/silent-feedback-frontend
echo.

pause
