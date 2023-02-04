import os
import random
from flask import Flask, request

app = Flask(__name__)


@app.route("/api/average", methods=['GET'])
def get_rand_num():
    res = random.randint(3,9)
    return {'number' : res}