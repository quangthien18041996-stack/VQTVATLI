@echo off
title Day code len GitHub - VQTVATLI
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
cd /d "%~dp0"

echo ======================================================================
echo          DANG KET NOI VA DAY MA NGUON LEN GITHUB REPOSITORY
echo          Repo: https://github.com/quangthien18041996-stack/VQTVATLI.git
echo ======================================================================
echo.

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/quangthien18041996-stack/VQTVATLI.git

echo Dang thuc hien git push...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  [THANH CONG] Toan bo ma nguon PhysicsHub THPT da duoc day len GitHub!
    echo  Xem tai: https://github.com/quangthien18041996-stack/VQTVATLI
    echo ======================================================================
) else (
    echo.
    echo [THONG BAO] Neu GitHub yeu cau Token, ban co the tao Personal Access Token
    echo tai: https://github.com/settings/tokens (chon quyen repo) va dan vao.
)

echo.
pause
