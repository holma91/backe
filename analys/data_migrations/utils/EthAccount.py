import requests
from lib.helper import wei_to_eth, fix_address
from operator import itemgetter

URL = "https://etherscan.io/accounts/label/exchange"
WRAPPED_ETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'


class EthAccount:
    def __init__(self, address: str, api_key: str):
        self.address = fix_address(address)
        self.api_key = api_key

    def get_transactions(self) -> list:
        transactions = requests.get(
            f'https://api.etherscan.io/api?module=account&action=txlist&address={self.address}&page=1&offset=10000&sort=asc&apikey={self.api_key}')
        return transactions.json()['result']

    def get_balance(self) -> str:
        balance = requests.get(
            f'https://api.etherscan.io/api?module=account&action=balance&address={self.address}&tag=latest&apikey={self.api_key}')
        return balance.json()['result']

    def get_internal_transactions(self) -> list:
        internal_txs = requests.get(
            f'https://api.etherscan.io/api?module=account&action=txlistinternal&address={self.address}&startblock=0&endblock=27025780&sort=asc&apikey={self.api_key}')
        return internal_txs.json()['result']

    def get_ERC20_token_transfer_events(self) -> list:
        token_transfer_events = requests.get(
            f'https://api.etherscan.io/api?module=account&action=tokentx&address={self.address}&startblock=0&endblock=27025780&sort=asc&apikey={self.api_key}')
        return token_transfer_events.json()['result']

    def get_token_contracts(self) -> list:
        contracts = set()
        ttes = self.get_ERC20_token_transfer_events()
        for tte in ttes:
            contracts.add(tte['contractAddress'])
        return list(contracts)

    def get_all_holdings(self) -> dict:
        # eth_balance = int(self.get_balance())
        # holdings = {
        #     'eth 0x0000000000000000000000000000000000000000': eth_balance}
        holdings = {}

        # unfucks WETH stuff
        txs = self.get_transactions()
        for tx in txs:
            tx['to'] = fix_address(tx['to'])
            tx['from'] = fix_address(tx['from'])
            wrapped_eth = fix_address(WRAPPED_ETH)
            if tx['to'] == wrapped_eth:
                if f'WETH {wrapped_eth}' not in holdings:
                    holdings[f'WETH {wrapped_eth}'] = int(
                        tx['value'])
                else:
                    holdings[f'WETH {wrapped_eth}'] += int(
                        tx['value'])

        # gets erc20 holdings
        token_transfer_events = self.get_ERC20_token_transfer_events()
        for event in token_transfer_events:
            event['to'] = fix_address(event['to'])
            event['from'] = fix_address(event['from'])
            event['contractAddress'] = fix_address(event['contractAddress'])
            if f"{event['tokenSymbol']} {event['contractAddress']}" not in holdings:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] = 0
            if event['to'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] += int(
                    event['value'])
            elif event['from'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] -= int(
                    event['value'])

        return holdings

    def get_balance_at_block_height(self, block_height: int) -> str:
        txs = self.get_transactions()
        itxs = self.get_internal_transactions()
        txs.extend(itxs)
        sorted_txs = sorted(txs, key=itemgetter('timeStamp'))

        balance = 0
        for tx in sorted_txs:
            if int(tx['blockNumber']) > block_height:
                break
            if tx['from'] == self.address and tx['to'] == self.address:
                balance -= int(tx['gasPrice']) * int(tx['gasUsed'])
            elif tx['from'] == self.address:
                if tx['isError'] == "0":
                    balance -= int(tx['value'])
                balance -= int(tx['gasPrice']) * int(tx['gasUsed'])
            else:
                # possibility for reverted TX in error here
                balance += int(tx['value'])

        return str(balance)

    def get_balance_at_timestamp(self, timestamp: int) -> str:
        txs = self.get_transactions()
        itxs = self.get_internal_transactions()
        txs.extend(itxs)
        sorted_txs = sorted(txs, key=itemgetter('timeStamp'))

        balance = 0
        for tx in sorted_txs:
            if int(tx['timeStamp']) > timestamp:
                break
            if tx['from'] == self.address and tx['to'] == self.address:
                balance -= int(tx['gasPrice']) * int(tx['gasUsed'])
            elif tx['from'] == self.address:
                if tx['isError'] == "0":
                    balance -= int(tx['value'])
                balance -= int(tx['gasPrice']) * int(tx['gasUsed'])
            else:
                # possibility for reverted TX in error here
                balance += int(tx['value'])

        return str(balance)

    def get_token_balance_at_block_height(self, block_height: int) -> dict:
        holdings = {}

        # unfucks WETH stuff
        txs = self.get_transactions()
        sorted_txs = sorted(txs, key=itemgetter('timeStamp'))
        for tx in sorted_txs:
            if int(tx['blockNumber']) > block_height:
                break
            tx['to'] = fix_address(tx['to'])
            tx['from'] = fix_address(tx['from'])
            wrapped_eth = fix_address(WRAPPED_ETH)
            if tx['to'] == wrapped_eth:
                if f'WETH {wrapped_eth}' not in holdings:
                    holdings[f'WETH {wrapped_eth}'] = int(
                        tx['value'])
                else:
                    holdings[f'WETH {wrapped_eth}'] += int(
                        tx['value'])

        # gets erc20 holdings
        token_transfer_events = self.get_ERC20_token_transfer_events()
        sorted_ttes = sorted(token_transfer_events,
                             key=itemgetter('timeStamp'))
        for event in sorted_ttes:
            if int(event['blockNumber']) > block_height:
                return holdings

            event['to'] = fix_address(event['to'])
            event['from'] = fix_address(event['from'])
            event['contractAddress'] = fix_address(event['contractAddress'])
            if f"{event['tokenSymbol']} {event['contractAddress']}" not in holdings:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] = 0
            if event['to'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] += int(
                    event['value'])
            elif event['from'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] -= int(
                    event['value'])

        return holdings

    def get_token_balance_at_timestamp(self, timestamp: int) -> dict:
        holdings = {
            'eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': self.get_balance_at_timestamp(timestamp)
        }

        # unfucks WETH stuff
        txs = self.get_transactions()
        sorted_txs = sorted(txs, key=itemgetter('timeStamp'))
        for tx in sorted_txs:
            if int(tx['timeStamp']) > timestamp:
                break
            tx['to'] = fix_address(tx['to'])
            tx['from'] = fix_address(tx['from'])
            wrapped_eth = fix_address(WRAPPED_ETH)
            if tx['to'] == wrapped_eth:
                if f'WETH {wrapped_eth}' not in holdings:
                    holdings[f'WETH {wrapped_eth}'] = int(
                        tx['value'])
                else:
                    holdings[f'WETH {wrapped_eth}'] += int(
                        tx['value'])

        # gets erc20 holdings
        token_transfer_events = self.get_ERC20_token_transfer_events()
        sorted_ttes = sorted(token_transfer_events,
                             key=itemgetter('timeStamp'))
        for event in sorted_ttes:
            if int(event['timeStamp']) > timestamp:
                return holdings

            event['to'] = fix_address(event['to'])
            event['from'] = fix_address(event['from'])
            event['contractAddress'] = fix_address(event['contractAddress'])
            if f"{event['tokenSymbol']} {event['contractAddress']}" not in holdings:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] = 0
            if event['to'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] += int(
                    event['value'])
            elif event['from'] == self.address:
                holdings[f"{event['tokenSymbol']} {event['contractAddress']}"] -= int(
                    event['value'])

        return holdings
