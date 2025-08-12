@echo off
echo Iniciando frontend React desde directorio correcto...
cd /d "c:\Users\Leonardo\OneDrive\Escritorio\consultas-riesgos\frontend"
echo Directorio actual: %cd%
echo Verificando package.json...
if exist package.json (
    echo ✅ package.json encontrado
    npm start
) else (
    echo ❌ package.json NO encontrado
    pause
)
