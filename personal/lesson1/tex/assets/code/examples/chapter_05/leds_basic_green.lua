local unpack = table.unpack
local ledNumber = 25                  -- размерность буфера
local leds = Ledbar.new(ledNumber)    -- объект управления лентой

local function changeColor(col)
  for i=0, ledNumber-1 do             -- индексы 0..24
    leds:set(i, unpack(col))          -- записываем RGB
  end
end

changeColor({0,1,0})                  -- включаем зелёный
