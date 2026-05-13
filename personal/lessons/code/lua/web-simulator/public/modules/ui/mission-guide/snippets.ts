export const TIMER_MISSION_EXAMPLE = `ap.push(Ev.MCE_PREFLIGHT)
Timer.callLater(2, function()
    ap.push(Ev.MCE_TAKEOFF)
end)

Timer.callLater(4, function()
    ap.goToLocalPoint(1, 1, 1)
end)

Timer.callLater(6, function()
    ap.push(Ev.MCE_LANDING)
end)`;

export const FSM_MISSION_EXAMPLE = `ap.push(Ev.MCE_PREFLIGHT)

function callback(event)
    if event == Ev.ENGINES_STARTED then
        ap.push(Ev.MCE_TAKEOFF)
    end

    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 1, 1)
    end

    if event == Ev.POINT_REACHED then
        ap.push(Ev.MCE_LANDING)
    end
end`;
