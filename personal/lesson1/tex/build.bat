@echo off
if not exist build mkdir build

:: Set PYTHONPATH to include settings folder for sitecustomize.py
set PYTHONPATH=%~dp0styles;%PYTHONPATH%

:: Update build version
python styles/update_version.py

xelatex -shell-escape -interaction=nonstopmode -output-directory=build main.tex
xelatex -shell-escape -interaction=nonstopmode -output-directory=build main.tex

:: Clean up root directory (just in case)
del *.aux *.log *.out *.toc *.synctex.gz *.xdv *.minted 2>nul
:: Clean up build directory from auxiliary files if needed, but keeping them speeds up re-builds
:: del build\*.aux build\*.log build\*.out build\*.toc 2>nul

echo Build complete. PDF is in build/main.pdf
