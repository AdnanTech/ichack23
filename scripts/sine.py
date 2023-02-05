import random
import matplotlib.pyplot as plt

zones = [(0, 40), (41, 50), (51, 90), (91, 110), (111, 130), (131, 150)]
val = 80

zone_default = 0.5
data = []
data2 = []
def moving_average(data, n):
  running_sum = 0
  smoothed_data = []
  for i in range(len(data)):
    running_sum += data[i]
    if i >= n:
      running_sum -= data[i - n]
    if i >= n - 1:
      smoothed_data.append(running_sum / n)
  return smoothed_data


for i in range(0, 100):
  if zones[0][0] <= val <= zones[0][1]:
    val += -30 if random.random() < zone_default / 2 / 2 else 10
  elif zones[1][0] <= val <= zones[1][1]:
    val += -20 if random.random() < zone_default / 2 else 10


  elif zones[2][0] <= val <= zones[2][1]:
    val += -10 if random.random() < zone_default else 10

  elif zones[3][0] <= val <= zones[3][1]:
    val += 10 if random.random() < zone_default / 2 else -10
  
  elif zones[4][0] <= val <= zones[4][1]:
    val += 10 if random.random() < zone_default / 2 / 2 else -10
  elif zones[5][0] <= val <= zones[5][1]:
    val += 40 if random.random() < zone_default / 2 / 2 / 2 else -10
  
  data.append(val)

  # smooth_data = moving_average(data, 15)
  # data2.append(smooth_data)
  

import numpy as np

# def perform_fft(data):
#   return np.fft.fft(data)

# transformed_data = perform_fft(data)

# def generate_sine_wave(data, frequency, amplitude):
#   x = np.linspace(0, 2 * np.pi, len(data))
#   return amplitude * np.sin(frequency * x)

# def smooth_data_with_sine(data, frequency, amplitude):
#   return data + generate_sine_wave(data, frequency, amplitude)

# transformed_data = smooth_data_with_sine(data, 10, 10)



# Plot the list of numbers
# plt.plot(data)

from scipy.ndimage import gaussian_filter1d

y = data
sigma = 1

x = np.linspace(0, len(y), len(y))
y_smooth = gaussian_filter1d(y, sigma)

fig, ax = plt.subplots()
ax.plot(x, y_smooth, '-')


zones = [(0, 40), (41, 50), (51, 90), (91, 110), (111, 130), (131, 150)]
ax.fill_between(x, 0, 40, color='red', alpha=0.3)
ax.fill_between(x, 41, 50, color='yellow', alpha=0.3)
ax.fill_between(x, 51, 90, color='grey', alpha=0.3)
ax.fill_between(x, 91, 110, color='yellow', alpha=0.3)
ax.fill_between(x, 111, 130, color='orange', alpha=0.3)
ax.fill_between(x, 131, 160, color='red', alpha=0.3)
plt.show()