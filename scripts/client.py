import requests
import time

a = []
while True:
    response = requests.get("http://127.0.0.1:5000/api/average")
    data = response.text
    print(data)
    time.sleep(1)

