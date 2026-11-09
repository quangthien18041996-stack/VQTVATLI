@echo off
chcp 65001 > nul
echo =======================================================
echo   ĐANG KHỞI CHẠY MATHVERSE 12 - WEBSITE DỰ THI KHKT
echo =======================================================
echo.
echo Trình duyệt sẽ mở tại địa chỉ: http://localhost:5173
echo.
call npm.cmd run dev
pause
