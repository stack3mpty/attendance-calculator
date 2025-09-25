@echo off
echo 考勤计算器部署脚本
echo ==================

echo.
echo 正在创建发布包...

REM 创建发布目录
if not exist "release" mkdir release

REM 复制必要文件
copy index.html release\
copy style.css release\
copy script.js release\
copy README.md release\

echo.
echo 文件复制完成！
echo.

echo 发布方式选择：
echo 1. 直接使用 - 双击 release\index.html
echo 2. GitHub Pages - 上传 release 文件夹到 GitHub 仓库
echo 3. Netlify - 拖拽 release 文件夹到 netlify.com
echo 4. Vercel - 上传 release 文件夹到 vercel.com
echo.

echo 发布包已创建在 release 文件夹中
echo 包含文件：
dir release

echo.
echo 按任意键退出...
pause >nul
