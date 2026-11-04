@echo off
setlocal enabledelayedexpansion
title WIJU Creator - Servidor Local
color 0E
cls

echo.
echo  ====================================================
echo    WIJU Creator  ^|  Servidor Local
echo  ====================================================
echo.

cd /d "%~dp0"

if not exist "index.html" (
    echo  [ERRO] index.html nao encontrado nesta pasta.
    echo  Coloque este arquivo .bat junto do index.html.
    echo.
    pause
    exit /b 1
)

REM ---- Detecta IP local (primeiro IPv4 encontrado) ----
set "IP_LOCAL="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=* delims= " %%b in ("%%a") do (
        if not defined IP_LOCAL set "IP_LOCAL=%%b"
    )
)

REM ---- Detecta servidor disponivel ----
set "CMD="
where py >nul 2>nul
if not errorlevel 1 (
    set "CMD=py -m http.server 5500"
    goto :start
)
where python >nul 2>nul
if not errorlevel 1 (
    set "CMD=python -m http.server 5500"
    goto :start
)
where php >nul 2>nul
if not errorlevel 1 (
    set "CMD=php -S localhost:5500"
    goto :start
)
where node >nul 2>nul
if not errorlevel 1 (
    set "CMD=npx --yes http-server -p 5500 -c-1"
    goto :start
)

echo  [ERRO] Nenhum servidor local encontrado.
echo.
echo  Instale o Python (recomendado): https://www.python.org/downloads/
echo  IMPORTANTE: marque "Add Python to PATH" durante a instalacao.
echo.
pause
exit /b 1

:start
echo   Servidor:  %CMD%
echo.
echo   Acesso neste computador:
echo       http://localhost:5500
if defined IP_LOCAL (
    echo.
    echo   Acesso pelo celular (mesma rede Wi-Fi^):
    echo       http://!IP_LOCAL!:5500
)
echo.
echo   Abrindo o navegador...
echo   Para encerrar: feche esta janela ou pressione CTRL+C.
echo.

start "" http://localhost:5500
%CMD%