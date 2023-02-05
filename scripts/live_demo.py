import os
import random
from datetime import datetime, timedelta
from respiratory_rate import gen_respiratory
import time

class Data:
  def __init__(self):
    self.prev_respiratory = 16
    self.prev_pulse_ox = 98
    self.prev_temp = 37
    self.prev_time = datetime.now()

  def setter(self, prev_respiratory, prev_pulse_ox, prev_temp):
    self.prev_respiratory = prev_respiratory
    self.prev_pulse_ox = prev_pulse_ox
    self.prev_temp = prev_temp
    self.time_increment()

  def time_increment(self):
    step = timedelta(minutes= 1)
    self.prev_time += step
    


import random
import matplotlib.pyplot as plt


data = []

def gen_respiratory(dataname, val):
  zones = []
  zone_default = 0.5
  if (dataname == "pulse_ox"):
    zones = [(0, 91), (92, 93), (94, 95), (96, 100)]
  elif (dataname == "respiratory"):
    zones = [(0, 8), (9, 11), (12, 20), (21, 24), (25, 40)]
  elif (dataname == "temp"):
    zones =  [(33, 35), (35.1, 36), (36.1, 38), (38.1, 39.0), (39.1, 42)]

  if dataname == "pulse_ox":
    if val == 100:
      val -=1
    else:
      if zones[0][0] <= val <= zones[0][1]:
        val += -4 if random.random() < zone_default / 2 / 2 / 2 else 2

      # base case
      elif zones[1][0] <= val <= zones[1][1]:
        val += -3 if random.random() < zone_default / 2 / 2 else 1

      elif zones[2][0] <= val <= zones[2][1]:
        val += -2 if random.random() < zone_default / 2 else 1

      #base case
      elif zones[3][0] <= val <= zones[3][1]:
        val += -1 if random.random() < zone_default else 1

  elif dataname == "temp":
    if zones[0][0] <= val <= zones[0][1]:
        val += -1 if random.random() < zone_default / 2 / 2 else 2

    elif zones[1][0] <= val <= zones[1][1]:
      val += -.5 if random.random() < zone_default / 2 else .5

    # base case
    elif zones[2][0] <= val <= zones[2][1]:
      val += -.5 if random.random() < zone_default else .5

    elif zones[3][0] <= val <= zones[3][1]:
      val += .5 if random.random() < zone_default / 2 else -.5

    elif zones[4][0] <= val <= zones[4][1]:
      val += 1 if random.random() < zone_default / 2 / 2 else -2

  else:
    # respiratory
    if zones[0][0] <= val <= zones[0][1]:
      val += -5 if random.random() < zone_default / 2 / 2 else 2
    elif zones[1][0] <= val <= zones[1][1]:
      val += -3 if random.random() < zone_default / 2 else 1
    # base case
    elif zones[2][0] <= val <= zones[2][1]:
      val += -1 if random.random() < zone_default else 1
    elif zones[3][0] <= val <= zones[3][1]:
      val += 3 if random.random() < zone_default / 2 else -1
    elif zones[4][0] <= val <= zones[4][1]:
      val += 5 if random.random() < zone_default / 2 / 2 else -2

  return val

def get_per_min(data):
  timestamp = data.prev_time.strftime('%Y-%m-%d %H:%M:%S')
  respiratory = gen_respiratory("respiratory", data.prev_respiratory)
  pulse_ox = gen_respiratory("pulse_ox", data.prev_pulse_ox)
  temp = gen_respiratory("temp", data.prev_temp)
  data.setter(respiratory, pulse_ox, temp)
  return {
      'timestamp': timestamp,
      'respiratory':  respiratory,
      'pulse_ox' : pulse_ox,
      'temp' : temp
      }

def plot_it():
  plt.ion() 
  fig, axs = plt.subplots(2, 2)
  x1 = []
  y1 = []
  x2 = []
  y2 = []
  x3 = []
  y3 = []
  x4 = []
  y4 = []

  for i in range(100):
    x1.append(i)
    y1.append(i**2)
    axs[0, 0].clear()
    axs[0, 0].plot(x1, y1)
    
    x2.append(i)
    y2.append(i**3)
    axs[0, 1].clear()
    axs[0, 1].plot(x2, y2)
    
    x3.append(i)
    y3.append(i**0.5)
    axs[1, 0].clear()
    axs[1, 0].plot(x3, y3)
    
    x4.append(i)
    y4.append(i**1.5)
    axs[1, 1].clear()
    axs[1, 1].plot(x4, y4)
    
    plt.draw()
    time.sleep(1)

  plt.show(block=True)


if __name__ == '__main__':
  data = Data()
  while True:
    print(get_per_min(data))
    # time.sleep(.1)

  # plot_it()