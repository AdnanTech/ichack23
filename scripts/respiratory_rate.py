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

  
# import numpy as np
# from scipy.ndimage import gaussian_filter1d

# y = data
# sigma = 1

# x = np.linspace(0, len(y), len(y))
# y_smooth = gaussian_filter1d(y, sigma)

# fig, ax = plt.subplots()
# ax.plot(x, y_smooth, '-')

# zones = [(0, 8), (9, 11), (12, 20), (21, 24), (25, 40)]
# ax.fill_between(x, 0, 8, color='red', alpha=0.3)
# ax.fill_between(x, 9, 11, color='yellow', alpha=0.3)
# ax.fill_between(x, 12, 20, color='grey', alpha=0.3)
# ax.fill_between(x, 21, 24, color='yellow', alpha=0.3)
# ax.fill_between(x, 25, 40, color='red', alpha=0.3)
# plt.show()