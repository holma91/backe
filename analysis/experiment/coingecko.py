import requests
import json
# tokens = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/list?include_platform=true').json()
# erc20_tokens = list(filter(
#     lambda token: 'ethereum' in token['platforms'] and token['platforms']['ethereum'] != "", tokens))
# print(len(erc20_tokens))
# print(json.dumps(tokens, indent=2))
# w_tokens = list(filter(
#     lambda token: len(token['platforms'].keys()) == 0 or ('ethereum' in token['platforms'].keys() and token['platforms']['ethereum'] == ""), tokens))
# print(json.dumps(w_tokens, indent=2))

# categories = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/categories/list').json()
# print(json.dumps(categories, indent=2))

# categories_data = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/categories').json()
# print(json.dumps(categories_data, indent=2))

# markets = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd').json()
# print(json.dumps(markets, indent=2))

# coin = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/tractor-joe').json()
# print(json.dumps(coin, indent=2))

# historical_token_price = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/joe/history?date=12-09-2021').json()
# print(json.dumps(historical_token_price, indent=2))

# gets the price, market cap and volume paired with timestamps
market_chart = requests.get(
    f'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=max').json()
print(json.dumps(market_chart, indent=2))

# market_chart_range = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range/?vs_currency=usd&from=1392577232&to=1422577232').json()
# print(json.dumps(market_chart_range, indent=2))

# status = requests.get(
#     f'https://api.coingecko.com/api/v3/coins/bitcoin/status_updates').json()
# print(json.dumps(status, indent=2))
