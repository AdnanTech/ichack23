import random
import matplotlib.pyplot as plt

zones = [(33, 35), (35.1, 36), (36.1, 38), (38.1, 39.0), (39.1, 42)]
val = 37

zone_default = 0.5
data = []

for i in range(0, 100):
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

  data.append(val)


def func():
  zones = [(33, 35), (35.1, 36), (36.1, 38), (38.1, 39.0), (39.1, 42)]
  val = 37

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

  return val

import numpy as np
from scipy.ndimage import gaussian_filter1d

y = data
sigma = 1

x = np.linspace(0, len(y), len(y))
y_smooth = gaussian_filter1d(y, sigma)

fig, ax = plt.subplots()
ax.plot(x, y_smooth, '-')

zones = [(33, 35), (35.1, 36), (36.1, 38), (38.1, 39.0), (39.1, 42)]
ax.fill_between(x, 33, 35, color='red', alpha=0.3)
ax.fill_between(x, 35.1, 36, color='yellow', alpha=0.3)
ax.fill_between(x, 36.1, 38, color='grey', alpha=0.3)
ax.fill_between(x, 38.1, 39, color='yellow', alpha=0.3)
ax.fill_between(x, 39.1, 42, color='red', alpha=0.3)
plt.show()