@echo off
title Day code len GitHub - VQTVATLI
setlocal enabledelayedexpansion
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

echo Chon phuong thuc xac thuc:
echo [1] Dang nhap tu dong qua Trinh duyet (Git Credential Manager)
echo [2] Nhap GitHub Personal Access Token (PAT)
echo.
set /p choice="Nhap lua chon cua ban (1 hoac 2, mac dinh la 1): "

if "%choice%"=="2" (
    echo.
    set /p token="Dan GitHub Personal Access Token (ghp_...): "
    if not "!token!"=="" (
        git remote set-url origin https://quangthien18041996-stack:!token!@github.com/quangthien18041996-stack/VQTVATLI.git
    )
)

echo.
echo Dang thuc hien git push len nhanh main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  [THANH CONG] Toan bo ma nguon PhysicsHub THPT da duoc day len GitHub!
    echo  Xem trang web va code tai: https://github.com/quangthien18041996-stack/VQTVATLI
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo [HUONG DAN] Neu day chua thanh cong, ban co the:
    echo 1. Tao Personal Access Token tai: https://github.com/settings/tokens
    echo    (Chon "Generate new token (classic)", tich chon quyen "repo")
    echo 2. Chay lai file nay va chon [2], dan Token vao la thanh cong ngay!
    echo ======================================================================
)

echo.
pause
