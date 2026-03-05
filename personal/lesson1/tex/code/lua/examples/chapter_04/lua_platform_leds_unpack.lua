local unpack = table.unpack
local ledNumber = 25
local leds = Ledbar.new(ledNumber)
local function changeColor(col)
  for i=0, ledNumber-1 do
    leds:set(i, unpack(col))
  end
end
changeColor({0,1,0})
