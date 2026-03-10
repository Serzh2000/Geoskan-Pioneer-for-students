# Урок 1 — структура и запуск

## Структура каталогов
- code/ — исходный код, используемый в книге и для запуска на квадрокоптере
  - code/lua — все Lua-примеры и задания
  - code/python — все Python-примеры и задания (в том числе расширенная навигация, ArUco, групповые полёты)
- data/ — данные и конфигурация для примеров
  - data/maps — карты и конфигурации (field_map.json, clever_map.yaml, map_config.json, genmap.txt)
  - data/markers — словари маркеров и метаданные (DICT_*.json)
- tex — исходники LaTeX (главы по Lua, LED, миссиям, Python, основной файл main.tex)
- tex/build — артефакты сборки LaTeX (pdf, лог, кэш minted)

## Сборка LaTeX
- Откройте каталог tex
- Соберите документ:

```bash
xelatex -shell-escape -interaction=nonstopmode main.tex
```

- Готовый PDF: tex/build/main.pdf

## Запуск Lua миссий
- Папка: lua/missions
- Все миссии запускают движение только после безопасной стабилизации: после события TAKEOFF_COMPLETE добавлена неблокирующая задержка 2 секунды через Timer.callLater
- Базовые миссии: base_01_circle.lua, base_02_polygon.lua, ...
- Продвинутые миссии: adv_07_accuracy_check.lua, adv_08_perimeter.lua, ...

## Примеры и утилиты
- Примеры сенсоров и команд полёта: examples/*.lua
- Примеры работы с RC: examples/example_rc8channel_test.lua
- Пример управления светодиодами: examples/example_led.lua, example_leds_4.lua

## Документация API
- Локально: vendor/pioneer-api-docs/index.html
- Ключевые методы:
  - ap.goToLocalPoint(x, y, z)
  - ap.updateYaw(angle) — угол в радианах
  - Timer.new(period, fn), Timer.callLater(delay, fn)
  - Sensors.rc(), Sensors.lpsYaw()

## Примечания
- Файлы кэша и логов LaTeX перенесены в tex/build
- Для единообразия имена Lua-примеров унифицированы (example_*)
