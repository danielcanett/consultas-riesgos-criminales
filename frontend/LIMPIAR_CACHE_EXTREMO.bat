@echo off
echo 🔥🔥🔥 LIMPIEZA AGRESIVA DE CACHE 🔥🔥🔥
echo.

echo 1. Deteniendo servidor frontend...
taskkill /F /IM node.exe 2>nul

echo 2. Limpiando cache de npm...
npm cache clean --force

echo 3. Eliminando node_modules...
if exist node_modules rmdir /s /q node_modules

echo 4. Eliminando build cache...
if exist build rmdir /s /q build

echo 5. Reinstalando dependencias...
npm install

echo 6. Iniciando servidor limpio...
npm start

echo.
echo 🔥 CACHE COMPLETAMENTE LIMPIO 🔥
pause
