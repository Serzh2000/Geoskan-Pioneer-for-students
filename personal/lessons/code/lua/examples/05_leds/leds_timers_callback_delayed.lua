local ledNumber = 25
local leds = Ledbar.new(ledNumber)
function callback(event)
  if (event == LOW_VOLTAGE2) then
    Timer.callLater(1, function ()
      for i=0, ledNumber-1 do leds:set(i, 1, 0, 0) end
    end)
  end
end
