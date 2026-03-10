from pioneer_sdk import Pioneer
import time

drone = Pioneer()
try:
    drone.arm()
    print("Взлет!")
    drone.takeoff()
    time.sleep(5) # Висение в воздухе
    print("Посадка...")
    drone.land()
finally:
    drone.disarm() # Гарантированная остановка
