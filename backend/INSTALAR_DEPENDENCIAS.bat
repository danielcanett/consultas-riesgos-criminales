@echo off
title Instalando Dependencias Frontend
color 0B
cls

echo ================================================
echo   INSTALANDO DEPENDENCIAS FALTANTES
echo ================================================
echo.

REM Ir al directorio frontend
cd /d "%~dp0"
cd ..\frontend

echo [INFO] Directorio actual: %CD%
echo.

REM Instalar todas las dependencias de Material-UI que faltan
echo [INFO] Instalando @mui/icons-material...
call npm install @mui/icons-material

echo [INFO] Instalando jspdf y html2canvas...
call npm install jspdf html2canvas

echo [INFO] Instalando dependencias adicionales de MUI...
call npm install @mui/lab @mui/x-date-pickers

echo [INFO] Verificando instalación...
call npm list @mui/icons-material jspdf html2canvas

echo.
echo [OK] Todas las dependencias instaladas correctamente
echo [INFO] Ahora puedes ejecutar EJECUTAR_FRONTEND.bat
echo.
pause
