from operator import itemgetter
from datetime import date, datetime, timezone, timedelta
import json

import psycopg2
import requests

from utils.EthAccount import EthAccount

weird_one_address = '0xd5cd84d6f044abe314ee7e414d37cae8773ef9d3'
one_address = '0x799a4202c12ca952cb311598a024c80ed371a41e'
WRAPPED_ETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'


def fix_address(address):
    return address.lower()


wrapped_eth = fix_address(WRAPPED_ETH)


def floor_date(timestamp):
    datetimeObj = datetime.utcfromtimestamp(timestamp)
    datetimeObj = datetimeObj.replace(second=0, hour=0, minute=0)
    return datetimeObj


def ceil_date(timestamp):
    return floor_date(timestamp) + timedelta(days=1)


def get_closest_timestamp(timestamp):
    ceil = ceil_date(timestamp).replace(tzinfo=timezone.utc).timestamp()
    floor = floor_date(timestamp).replace(tzinfo=timezone.utc).timestamp()
    to_floor = timestamp - floor
    to_ceil = ceil - timestamp
    if to_floor < to_ceil:
        return int(floor)
    else:
        return int(ceil)


def to_correct_unit(value, token_decimals):
    return str(value * 10 ** -token_decimals)


def take_snapshot(acc, holdings, inflow_from_eoa, timestamp, inflows, outflows):
    con = psycopg2.connect(
        host="localhost",
        database="jocke",
        user="alexander",
        password="")

    cur = con.cursor()
    account_value_usd = 0
    for token in holdings.keys():
        cur.execute("""select price_in_usd, token.decimals from token_snapshot as ts
                    join token on token.address = ts.address
                    where snapshot_timestamp = to_timestamp(%s) AT TIME ZONE 'UTC'
                    and ts.address = %s""",
                    (timestamp, token[-42:]))
        rows = cur.fetchall()
        if len(rows) != 1:
            # too bad, no price data for this token at this timestamp
            print(f"no data for {token} at {timestamp}")
            continue
        price = float(rows[0][0])
        decimals = int(rows[0][1])
        # get token_decimals
        holdings_correct_unit = float(to_correct_unit(holdings[token], decimals))
        value = price * holdings_correct_unit
        account_value_usd += value

    inflow_value_usd = 0
    inflow_value_eth = 0

    for inflow in inflows:
        inflow_value_usd += inflow['value_usd']
        inflow_value_eth += inflow['value_eth']

    outflow_value_usd = 0
    outflow_value_eth = 0

    for outflow in outflows:
        outflow_value_usd += outflow['value_usd']
        outflow_value_eth += outflow['value_eth']

    cur.execute("""select price_in_usd from token_snapshot
                    where snapshot_timestamp = to_timestamp(%s) AT TIME ZONE 'UTC'
                    and address = %s""",
                (timestamp, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))
    rows = cur.fetchall()
    if len(rows) != 1:
        # should never happen
        print(f"no data for ETHEREUM at {timestamp}")

    eth_price = float(rows[0][0])
    account_value_eth = account_value_usd / eth_price

    profit_usd = account_value_usd + outflow_value_usd - inflow_value_usd
    profit_eth = account_value_eth + outflow_value_eth - inflow_value_eth

    snapshot = {
        'address': acc.address,
        'account_value_usd': account_value_usd,
        'account_value_eth': account_value_eth,
        'inflow_value_usd': inflow_value_usd,
        'inflow_value_eth': inflow_value_eth,
        'outflow_value_usd': outflow_value_usd,
        'outflow_value_eth': outflow_value_eth,
        'profit_usd': profit_usd,
        'profit_eth': profit_eth,
        # 'holdings': copy.deepcopy(holdings),
        # 'inflow_from_eoa': copy.deepcopy(inflow_from_eoa),
        # 'inflows': copy.deepcopy(inflows),
        # 'outflows': copy.deepcopy(outflows),
        'timestamp': timestamp,

    }

    snapshot['timestamp'] = datetime.utcfromtimestamp(snapshot['timestamp']).astimezone()

    cur.execute("""insert into account_snapshot (address, account_value_usd, account_value_eth, profit_usd, 
                profit_eth, inflow_value_usd, inflow_value_eth, outflow_value_usd, outflow_value_eth, 
                snapshot_timestamp) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);""",
                (snapshot['address'], snapshot['account_value_usd'], snapshot['account_value_eth'], snapshot['profit_usd'],
                 snapshot['profit_eth'], snapshot['inflow_value_usd'], snapshot['inflow_value_eth'], snapshot['outflow_value_usd'], snapshot['outflow_value_eth'],
                 snapshot['timestamp']))

    con.commit()
    cur.close()
    con.close()

    return snapshot


def get_timestamps(sorted_txs) -> list:
    last_tx_tuple = datetime.utcfromtimestamp(
        int(sorted_txs[-1]['timeStamp'])).timetuple()
    last_tx = datetime(last_tx_tuple[0], last_tx_tuple[1],
                       last_tx_tuple[2]).replace(tzinfo=timezone.utc)

    first_tx_tuple = datetime.utcfromtimestamp(
        int(sorted_txs[0]['timeStamp'])).timetuple()
    first_tx = datetime(first_tx_tuple[0], first_tx_tuple[1], first_tx_tuple[2]
                        ).replace(tzinfo=timezone.utc)

    diff = last_tx - first_tx
    timestamps = [int(datetime.timestamp(last_tx + timedelta(days=1) - timedelta(days=a)))
                  for a in range(diff.days+2)]

    return timestamps[::-1]


def get_account_type(address):
    account_code = requests.post(f'https://eth-mainnet.alchemyapi.io/v2/{ALCHEMY_KEY}', json={
        "jsonrpc": "2.0",
        "method": "eth_getCode",
        "params": [f"{address}", "latest"],
        "id": 0
    }).json()
    if account_code['result'] == '0x':
        return 'EOA'
    else:
        return 'CA'


def is_organic(address):

    # Check if it account is EOA or CA
    account_type = get_account_type(address)
    if account_type == 'EOA':
        return False

    # Check if it is a exchange owned CA
    with open('all_exchanges.json', 'r') as exchanges_file:
        data = exchanges_file.read()
    exchanges = json.loads(data)

    if address in exchanges.keys():
        return False

    with open('all_bridges.json', 'r') as bridges_file:
        data = bridges_file.read()
    bridges = json.loads(data)

    if address in bridges.keys():
        return False

    if address == fix_address(WRAPPED_ETH):
        return False

    return True


def get_flow(tx, flow_type):
    con = psycopg2.connect(
        host="localhost",
        database="jocke",
        user="alexander",
        password="")

    cur = con.cursor()

    identifier = ""
    value_usd = 0
    value_eth = 0

    if flow_type == 'tte':
        identifier = f"{tx['tokenSymbol']} {tx['contractAddress']}"
    elif flow_type == 'tx weth':
        identifier = f'WETH {wrapped_eth}'
    else:
        identifier = 'eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

    timestamp = get_closest_timestamp(int(tx['timeStamp']))

    cur.execute("""select price_in_usd, token.decimals from token_snapshot as ts
                    join token on token.address = ts.address
                    where snapshot_timestamp = to_timestamp(%s) AT TIME ZONE 'UTC'
                    and ts.address = %s""",
                (timestamp, identifier[-42:]))
    rows = cur.fetchall()

    if len(rows) != 1:
        # too bad, no price data for this token at this timestamp
        print(f"no data for {identifier} at {timestamp}")
        return {
            identifier: int(tx['value']),
            'value_usd': 0,
            'value_eth': 0,
            'tx_hash': tx['hash']
        }

    price_in_usd = float(rows[0][0])
    decimals = int(rows[0][1])
    value_correct_unit = float(to_correct_unit(int(tx['value']), decimals))
    value_usd = price_in_usd * value_correct_unit

    cur.execute("""select price_in_usd from token_snapshot
                    where snapshot_timestamp = to_timestamp(%s) AT TIME ZONE 'UTC'
                    and address = %s""",
                (timestamp, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))
    rows = cur.fetchall()
    if len(rows) != 1:
        # should never happen
        print(f"no data for ETHEREUM at {timestamp}")
    eth_price = float(rows[0][0])

    value_eth = value_usd / eth_price

    return {
        identifier: int(tx['value']),
        'value_usd': value_usd,
        'value_eth': value_eth,
        'tx_hash': tx['hash']
    }


def get_snapshots(acc):
    txs = acc.get_transactions()
    itxs = acc.get_internal_transactions()
    txs.extend(itxs)
    ttes = acc.get_ERC20_token_transfer_events()
    txs.extend(ttes)
    sorted_txs = sorted(txs, key=itemgetter('timeStamp'))

    timestamps = get_timestamps(sorted_txs)  # all the timestamps we care about
    count = 0

    holdings = {
        'eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 0
    }
    snapshots = []
    inflow_from_eoa = {
        'eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 0
    }
    inflows = []
    outflows = []

    for tx in sorted_txs:
        if len(timestamps) > count and int(tx['timeStamp']) > timestamps[count]:
            snapshot = take_snapshot(acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
            snapshots.append(snapshot)
            count += 1
            while len(timestamps) > count and int(tx['timeStamp']) > timestamps[count]:
                snapshot = take_snapshot(acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
                # print(json.dumps(snapshot, indent=2))
                snapshots.append(snapshot)
                count += 1

        # print(json.dumps(tx, indent=2))

        if 'tokenName' in tx.keys():
            # its a TTE
            if tx['contractAddress'] == '0xd5cd84d6f044abe314ee7e414d37cae8773ef9d3':
                tx['contractAddress'] = one_address
                tx['tokenSymbol'] = 'ONE'
            tx['to'] = fix_address(tx['to'])
            tx['from'] = fix_address(tx['from'])
            tx['contractAddress'] = fix_address(tx['contractAddress'])

            if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in holdings:
                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = 0

            if tx['to'] == acc.address:
                # is tx['from'] == EOA or EXC?
                if not is_organic(tx['from']):
                    if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in inflow_from_eoa:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = int(tx['value'])
                    else:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] += int(tx['value'])
                    inflow = get_flow(tx, 'tte')
                    inflows.append(inflow)

                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] += int(tx['value'])
            elif tx['from'] == acc.address:
                if not is_organic(tx['to']):
                    if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in inflow_from_eoa:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = int(tx['value']) * (-1)
                    else:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] -= int(tx['value'])

                    outflow = get_flow(tx, 'tte')
                    outflows.append(outflow)

                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] -= int(tx['value'])
                # balance -= int(tx['gasPrice']) * int(tx['gasUsed'])

        else:
            # its a TX
            if tx['from'] == acc.address and tx['to'] == acc.address:
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(tx['gasPrice']) * int(tx['gasUsed'])
            elif tx['from'] == acc.address:
                if tx['isError'] == "0":
                    wrapped_eth = fix_address(WRAPPED_ETH)
                    if tx['to'] == wrapped_eth:
                        if f'WETH {wrapped_eth}' not in holdings:
                            holdings[f'WETH {wrapped_eth}'] = int(tx['value'])
                        else:
                            holdings[f'WETH {wrapped_eth}'] += int(tx['value'])

                        if f'WETH {wrapped_eth}' not in inflow_from_eoa:
                            inflow_from_eoa[f'WETH {wrapped_eth}'] = int(tx['value'])
                        else:
                            inflow_from_eoa[f'WETH {wrapped_eth}'] += int(tx['value'])

                        inflow = get_flow(tx, 'tx weth')
                        inflows.append(inflow)

                    if not is_organic(tx['to']):
                        inflow_from_eoa[f"eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"] -= int(tx['value'])
                        outflow = get_flow(tx, 'tx')
                        outflows.append(outflow)

                    holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(tx['value'])

                # gas is payed even if tx fails
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(tx['gasPrice']) * int(tx['gasUsed'])

            else:
                # is tx['from'] an EOA?
                if not is_organic(tx['from']):
                    inflow_from_eoa[f"eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"] += int(tx['value'])
                    inflow = get_flow(tx, 'tx')
                    inflows.append(inflow)
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] += int(tx['value'])

    while len(timestamps) > count and int(sorted_txs[-1]['timeStamp']) > timestamps[count]:
        snapshot = take_snapshot(acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
        snapshots.append(snapshot)
        count += 1

    while len(timestamps) > count:
        snapshot = take_snapshot(acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
        snapshots.append(snapshot)
        count += 1

    return snapshots


# for acc in accs
acc1 = EthAccount(ACCOUNT1, APIKEY_ETHERSCAN)

snapshots = get_snapshots(acc1)
