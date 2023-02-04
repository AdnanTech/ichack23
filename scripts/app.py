import os
import random
from flask import Flask, request

app = Flask(__name__)


@app.route("/api/per_sec", methods=['GET'])
def get_rand_num(t):
    oxygen = random.randint(3,9)
    respiratory = random.randint(3,9)
    Puluse_ox = random.randint(3,9)
    return {
        
        }

@app.route("/api/per_min", methods=['GET'])
def get_rand_num(t):
    respiratory = random.randint(3,9)
    Puluse = random.randint(3,9)
    temp = random.randint(10,50)
    return {
        'respiratory':  respiratory,
        'puluse' : Puluse,
        'temp' : temp
        }

@app.route("/api/per_day", methods=['GET'])
def get_rand_num(t):
    steps = random.randint(0,10000)
    return {
        'stpes' : steps
        }