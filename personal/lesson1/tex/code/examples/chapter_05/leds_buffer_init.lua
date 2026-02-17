local unpack = table.unpack
local ledNumber = 4                   -- размерность буфера (всегда 4!)
local leds = Ledbar.new(ledNumber)    -- объект управления лентой

local function changeColor(col)
  for i=0, ledNumber-1 do             -- проходим по всем индексам 0..3
    leds:set(i, unpack(col))          -- записываем RGB в буфер
  end
end

changeColor({0,1,0})                  -- включаем зелёный
