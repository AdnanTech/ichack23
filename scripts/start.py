from terra.base_client import Terra

from configobj import ConfigObj
config = ConfigObj('config.cfg')

from datetime import datetime

def main():
  terra = Terra(api_key=config['api']['api_key'], dev_id=config['api']['dev_id'], secret=config['api']['secret'])
  
  # provider is data source (APPLE, GOOGLE, HUAWEI)
  resource_api_response = terra.list_providers()
  print(resource_api_response.get_parsed_response())

if __name__ == '__main__':
  main()