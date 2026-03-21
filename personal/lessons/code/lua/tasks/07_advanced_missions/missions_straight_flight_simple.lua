ap.push(MCE_PREFLIGHT)                 -- предстарт
Timer.callLater(1, function()             -- через 1 секунду
  ap.push(MCE_TAKEOFF)                 -- взлёт
end)

local unpack = table.unpack               -- сокращение доступа к распаковке
local target = {1.0, 0.0, 0.8}            -- целевая точка (x,y,z)

function callback(event)                   -- обработчик событий
  if event == TAKEOFF_COMPLETE then     -- после взлёта
    ap.goToLocalPoint(unpack(target))      -- команда полёта к точке
  end
  if event == POINT_REACHED then        -- точка достигнута
    ap.push(MCE_LANDING)                -- выполнить посадку
  end
end
