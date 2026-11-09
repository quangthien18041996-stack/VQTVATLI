@echo off
chcp 65001 > nul
echo =======================================================
echo   ĐANG ĐÓNG GÓI WEBSITE VÀO THƯ MỤC "dist"
echo =======================================================
echo.
call npm.cmd run build
echo.
echo Đã đóng gói thành công! Bạn chỉ cần kéo thả thư mục "dist"
echo vào https://app.netlify.com/drop hoặc đẩy lên Vercel/GitHub Pages.
echo.
pause
