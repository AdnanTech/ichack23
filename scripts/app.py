import os
import random
from flask import Flask, request

app = Flask(__name__)



@app.route("/api/per_min", methods=['GET'])
def get_rand_num():
    respiratory = random.randint(4,30)
    puluse_ox = random.randint(75,120)
    temp = random.randint(10,50)
    return {
        'respiratory':  respiratory,
        'puluse_ox' : puluse_ox,
        'temp' : temp
        }

@app.route("/api/per_day", methods=['GET'])
def get_rand_num(t):
    steps = random.randint(0,10000)
    return {
        'stpes' : steps
        }