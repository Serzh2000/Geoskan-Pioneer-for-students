-- Unit tests for Pioneer Lua Environment
local function assert_not_nil(val, name)
    if val == nil then error("Assertion failed: " .. name .. " is nil") end
    print("OK: " .. name .. " is initialized")
end

-- 1. Test Global Objects
assert_not_nil(Ledbar, "Ledbar")
assert_not_nil(ap, "ap")
assert_not_nil(Sensors, "Sensors")
assert_not_nil(Timer, "Timer")
assert_not_nil(Ev, "Ev")

-- 2. Test Ledbar initialization
local leds = Ledbar.new(4)
assert_not_nil(leds, "Ledbar instance")
if leds.count ~= 4 then error("Ledbar count mismatch") end
print("OK: Ledbar instance created with 4 leds")

-- 3. Test Ledbar set (no error)
leds:set(0, 1, 0, 0) -- Red
leds:set(1, 0, 1, 0) -- Green
leds:set(2, 0, 0, 1) -- Blue
leds:set(3, 1, 1, 1) -- White
print("OK: Ledbar:set functions correctly")

-- 4. Test Sensors
local x, y, z = Sensors.lpsPosition()
assert_not_nil(x, "Sensors.lpsPosition X")
print("OK: Sensors API is reachable")

-- 5. Test Events
if Ev.MCE_TAKEOFF ~= 2 then error("Event constant mismatch") end
print("OK: Event constants are correct")

print("--- ALL TESTS PASSED ---")
