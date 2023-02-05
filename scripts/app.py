import os
import random
from flask import Flask, request
from datetime import datetime, timedelta
from respiratory_rate import gen_respiratory
from twilio.rest import Client 
 
account_sid = 'ACd0bd1b2e9b5eeb93ff954d95647a757d' 
client = Client(account_sid, auth_token) 

app = Flask(__name__)

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
    
data = Data()


@app.route("/api/per_min", methods=['GET'])
def get_per_min():
    timestamp = data.prev_time.strftime('%H:%M:%S')
    respiratory = gen_respiratory("respiratory", data.prev_respiratory)
    pulse_ox = gen_respiratory("pulse_ox", data.prev_pulse_ox)
    temp = gen_respiratory("temp", data.prev_temp)
    data.setter(respiratory, pulse_ox, temp)
    print(pulse_ox, temp)
    return {
        'timestamp': timestamp,
        'respiratory':  respiratory,
        'pulse_ox' : pulse_ox,
        'temp' : temp
        }

@app.route("/api/per_day", methods=['GET'])
def get_per_day():
    steps = random.randint(0,10000)
    return {
        'steps' : steps
        }

@app.route("/api/send_sms", methods=['GET'])
def send_sms():
    message = client.messages.create(body='Please contant your doctor immediately, your vital signs have been consistently abnormal.', from_="whatsapp:+14155238886", to='whatsapp:+60109828579') 
    return "message sent"
