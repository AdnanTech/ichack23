import os
import random
from flask import Flask, request
from datetime import datetime, timedelta

app = Flask(__name__)

class Data:
    def __init__(self):
        self.prev_respiratory = 10
        self.prev_puluse_ox = 80
        self.prev_temp = 25
        self.prev_time = datetime.now()

    def setter(self, prev_respiratory, prev_puluse_ox, prev_temp):
        self.prev_respiratory = prev_respiratory
        self.prev_puluse_ox = prev_puluse_ox
        self.prev_temp = prev_temp
        self.time_increment()

    def time_increment(self):
        step = timedelta(minutes= 1)
        self.prev_time += step
    
data = Data()


@app.route("/api/per_min", methods=['GET'])
def get_per_min():
    timestamp = data.prev_time.strftime('%Y-%m-%d %H:%M:%S')
    respiratory = random.randint(4,30)
    puluse_ox = random.randint(75,120)
    temp = random.randint(10,50)
    data.setter(respiratory, puluse_ox, temp)
    return {
        'timestamp': timestamp,
        'respiratory':  respiratory,
        'puluse_ox' : puluse_ox,
        'temp' : temp
        }

@app.route("/api/per_day", methods=['GET'])
def get_per_day():
    steps = random.randint(0,10000)
    return {
        'steps' : steps
        }