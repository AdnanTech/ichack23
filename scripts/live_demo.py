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
from respiratory_rate import gen_respiratory

data = []


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