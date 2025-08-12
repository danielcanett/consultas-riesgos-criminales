@echo off
title Servidor Backend - Consultas de Riesgo
color 0A
cls

echo ================================================
echo   INICIANDO SERVIDOR BACKEND - PUERTO 3001
echo ================================================
echo.

REM Ir al directorio del script
cd /d "%~dp0"

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado
    pause
    exit /b 1
)

REM Mostrar info
echo [INFO] Python encontrado:
python --version
echo [INFO] Directorio: %CD%
echo.

REM Cerrar procesos previos
taskkill /f /im python.exe 2>nul >nul
echo [INFO] Procesos previos cerrados
echo.

REM Instalar dependencias
echo [INFO] Instalando dependencias...
pip install --quiet fastapi uvicorn google-generativeai httpx
echo [OK] Dependencias instaladas
echo.

REM Verificar archivo
if not exist unified_server.py (
    echo [ERROR] unified_server.py no encontrado
    pause
    exit /b 1
)

REM Ejecutar servidor
echo [INFO] Iniciando servidor en puerto 3001...
echo [INFO] Presiona Ctrl+C para detener
echo ================================================
echo.

python unified_server.py

echo.
echo [INFO] Servidor detenido
pause
