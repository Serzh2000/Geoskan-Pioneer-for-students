ap.push(MCE_PREFLIGHT)                 -- предстарт
Timer.callLater(1, function()             -- через 1 секунду
  ap.push(MCE_TAKEOFF)                 -- инициировать взлёт
end)

function callback(event)                   -- обработчик системных событий
  if event == TAKEOFF_COMPLETE then     -- взлёт завершён
    ap.push(MCE_LANDING)                -- выполнить посадку
  end
  if event == COPTER_LANDED then        -- посадка завершена
    ap.push(ENGINES_DISARM)             -- выключить двигатели
  end
end
