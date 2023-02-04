
import requests

url = "https://api.tryterra.co/v2/daily?user_id=ed441ee1-b535-4bbe-8ca4-06144e1e395d&start_date=2023-01-31&to_webhook=false"

payload={}
headers = {
  'dev-id': 'ichack-team-adnan-dev-61QL3bMo4c',
  'X-API-Key': '991eba45c0fb074e22a91924754db212a0b49ee11024a48904ef4bab819504ef'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.json())
