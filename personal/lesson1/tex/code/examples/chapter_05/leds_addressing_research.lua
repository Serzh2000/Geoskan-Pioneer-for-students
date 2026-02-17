local leds = Ledbar.new(4)

-- Функция для очистки (выключения всех)
local function clear()
    for i=0, 3 do leds:set(i, 0,0,0) end
end

clear()
-- Включаем индекс 0
leds:set(0, 1, 0, 0) 
-- Если загорелся не тот, который вы ожидали — поменяйте 0 на 1, 2 или 3
