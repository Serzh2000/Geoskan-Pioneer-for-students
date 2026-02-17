local unpack = table.unpack
local ledNumber = 4
local leds = Ledbar.new(ledNumber)

local function changeColor(col)
    for i=0, ledNumber - 1, 1 do
        leds:set(i, unpack(col))
    end
end

-- Задание 1: Зеленый свет (включаем все 4 светодиода)
changeColor({0, 1, 0})
