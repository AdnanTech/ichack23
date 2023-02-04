import random
import time

def simulate_temperature():
  # Start with an average temperature
  temp = 98.6

  while True:
    # Increase or decrease temperature randomly
    temp += random.uniform(-0.5, 0.5)

    # Simulate a spike in temperature every 10-15 seconds
    if random.random() < 0.05:
      temp -= random.uniform(0.5, 1.0)

    print("Current temperature:", temp)

    # Wait for 1 second before simulating the next temperature
    # time.sleep(1)

simulate_temperature()