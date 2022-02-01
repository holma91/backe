from operator import itemgetter
from datetime import date, datetime, timezone, timedelta

from utils.EthAccount import EthAccount
from utils.env import APIKEY_ETHERSCAN, ALCHEMY_KEY
from utils.helpers import fix_address, get_account_type
from utils.json_load import get_accounts, get_bridges, get_exchanges
from utils.db_utils import connect_to_database

WIERD_ONE_ADDRESS = '0xd5cd84d6f044abe314ee7e414d37cae8773ef9d3'
ONE_ADDRESS = '0x799a4202c12ca952cb311598a024c80ed371a41e'
WRAPPED_ETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
START_TIMESTAMP = 1609459200
END_TIMESTAMP = 1640995200
fix_wrapped_eth = fix_address(WRAPPED_ETH)


STATS = {
    'address': '',
    'start_value_usd': 0,
    'start_value_eth': 0,
    'end_value_usd': 0,
    'end_value_eth': 0,
    'profit_usd': 0,
    'profit_eth': 0,
    'against_usd': 0,
    'against_eth': 0,
    'tx_count': 0,
    'year': 0,
}


def floor_date(timestamp):
    datetimeObj = datetime.utcfromtimestamp(timestamp)
    datetimeObj = datetimeObj.replace(second=0, hour=0, minute=0)
    return datetimeObj


def ceil_date(timestamp) -> datetime:
    return floor_date(timestamp) + timedelta(days=1)


def get_closest_timestamp(timestamp) -> int:
    ceil = ceil_date(timestamp).replace(tzinfo=timezone.utc).timestamp()
    floor = floor_date(timestamp).replace(tzinfo=timezone.utc).timestamp()
    to_floor = timestamp - floor
    to_ceil = ceil - timestamp
    if to_floor < to_ceil:
        return int(floor)
    else:
        return int(ceil)


def to_correct_unit(value, token_decimals) -> str:
    return str(value * 10 ** - token_decimals)


def is_in2021(timestamp) -> bool:
    return timestamp >= START_TIMESTAMP and timestamp <= END_TIMESTAMP


def take_snapshot(acc, holdings, inflow_from_eoa, timestamp, inflows, outflows):

    with connect_to_database() as (con, cur):
        con.autocommit = True

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
                # print(f"no data for {token} at {timestamp}")
                continue
            price = float(rows[0][0])
            decimals = int(rows[0][1])
            # get token_decimals
            holdings_correct_unit = float(
                to_correct_unit(holdings[token], decimals))
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

        snapshot['timestamp'] = datetime.utcfromtimestamp(
            snapshot['timestamp']).astimezone()

        if timestamp == START_TIMESTAMP:
            STATS['address'] = snapshot['address']
            STATS['start_value_usd'] = snapshot['account_value_usd']
            STATS['start_value_eth'] = snapshot['account_value_eth']
            STATS['year'] = 2021
            STATS['inflow_before2021_usd'] = snapshot['inflow_value_usd']
            STATS['inflow_before2021_eth'] = snapshot['inflow_value_eth']
            STATS['outflow_before2021_usd'] = snapshot['outflow_value_usd']
            STATS['outflow_before2021_eth'] = snapshot['outflow_value_eth']

        if timestamp == END_TIMESTAMP:

            inflow2021_usd = snapshot['inflow_value_usd'] - \
                STATS['inflow_before2021_usd']
            inflow2021_eth = snapshot['inflow_value_eth'] - \
                STATS['inflow_before2021_eth']
            outflow2021_usd = snapshot['outflow_value_usd'] - \
                STATS['outflow_before2021_usd']
            outflow2021_eth = snapshot['outflow_value_eth'] - \
                STATS['outflow_before2021_eth']

            STATS['start_value_usd'] += inflow2021_usd
            STATS['start_value_eth'] += inflow2021_eth
            STATS['end_value_usd'] = snapshot['account_value_usd'] + \
                outflow2021_usd
            STATS['end_value_eth'] = snapshot['account_value_eth'] + \
                outflow2021_eth
            STATS['profit_usd'] = STATS['end_value_usd'] - \
                STATS['start_value_usd']
            STATS['profit_eth'] = STATS['end_value_eth'] - \
                STATS['start_value_eth']
            if (STATS['start_value_usd'] != 0 and STATS['start_value_eth'] != 0):
                STATS['against_usd'] = STATS['end_value_usd'] / \
                    STATS['start_value_usd']
                STATS['against_eth'] = STATS['end_value_eth'] / \
                    STATS['start_value_eth']
            else:
                STATS['against_usd'] = 1
                STATS['against_eth'] = 1

            cur.execute("""insert into account_stats (address, start_value_usd, start_value_eth, end_value_usd, 
                        end_value_eth, profit_usd, profit_eth, against_usd, against_eth, tx_count, year) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);""",
                        (STATS['address'], STATS['start_value_usd'], STATS['start_value_eth'], STATS['end_value_usd'],
                         STATS['end_value_eth'], STATS['profit_usd'], STATS['profit_eth'], STATS['against_usd'], STATS['against_eth'],
                         STATS['tx_count'], STATS['year']))

    # con.commit()
    cur.close()
    con.close()

    return snapshot


def get_timestamps(sorted_txs) -> list:
    START_TIMESTAMP = 1609459200
    END_TIMESTAMP = 1640995200
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

    relevant_timestamps = list(
        filter(lambda timestamp: (timestamp <= END_TIMESTAMP), timestamps))

    if START_TIMESTAMP not in relevant_timestamps:
        relevant_timestamps.append(START_TIMESTAMP)

    relevant_timestamps.sort()

    return relevant_timestamps


def account_is_organic(address, exchanges, bridges):

    # Check if it is a exchange owned CA
    if address in exchanges:
        return False

    if address in bridges:
        return False

    if address == fix_address(WRAPPED_ETH):
        return False

    # Check if it account is EOA or CA
    account_type = get_account_type(address)
    if account_type == 'EOA':
        return False

    return True


def get_flow(tx, flow_type):

    with connect_to_database() as (con, cur):

        identifier = ""
        value_usd = 0
        value_eth = 0

        if flow_type == 'tte':
            identifier = f"{tx['tokenSymbol']} {tx['contractAddress']}"
        elif flow_type == 'tx weth':
            identifier = f'WETH {fix_wrapped_eth}'
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
            print(
                f"no data for {identifier} ({identifier[-42]}) at {timestamp}")
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


def get_snapshots(acc, exchanges, bridges):
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

        if len(timestamps) <= count:
            return snapshots

        if int(tx['timeStamp']) > timestamps[count]:
            snapshot = take_snapshot(
                acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
            snapshots.append(snapshot)
            count += 1
            while len(timestamps) > count and int(tx['timeStamp']) > timestamps[count]:
                snapshot = take_snapshot(
                    acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
                snapshots.append(snapshot)
                count += 1

        if 'tokenName' in tx.keys():
            # its a TTE
            if tx['contractAddress'] == '0xd5cd84d6f044abe314ee7e414d37cae8773ef9d3':
                tx['contractAddress'] = ONE_ADDRESS
                tx['tokenSymbol'] = 'ONE'
            tx['to'] = fix_address(tx['to'])
            tx['from'] = fix_address(tx['from'])
            tx['contractAddress'] = fix_address(tx['contractAddress'])

            if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in holdings:
                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = 0

            if tx['to'] == acc.address:
                # is tx['from'] == EOA or EXC?
                if not account_is_organic(tx['from'], exchanges, bridges):
                    if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in inflow_from_eoa:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = int(
                            tx['value'])
                    else:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] += int(
                            tx['value'])
                    inflow = get_flow(tx, 'tte')
                    inflows.append(inflow)

                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] += int(
                    tx['value'])
            elif tx['from'] == acc.address:
                if not account_is_organic(tx['to'], exchanges, bridges):
                    if f"{tx['tokenSymbol']} {tx['contractAddress']}" not in inflow_from_eoa:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] = int(
                            tx['value']) * (-1)
                    else:
                        inflow_from_eoa[f"{tx['tokenSymbol']} {tx['contractAddress']}"] -= int(
                            tx['value'])

                    outflow = get_flow(tx, 'tte')
                    outflows.append(outflow)

                holdings[f"{tx['tokenSymbol']} {tx['contractAddress']}"] -= int(
                    tx['value'])
                # balance -= int(tx['gasPrice']) * int(tx['gasUsed'])

        else:
            # its a TX
            if is_in2021(int(tx['timeStamp'])):
                STATS['tx_count'] += 1
            if tx['from'] == acc.address and tx['to'] == acc.address:
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(
                    tx['gasPrice']) * int(tx['gasUsed'])
            elif tx['from'] == acc.address:
                if tx['isError'] == "0":
                    wrapped_eth = fix_address(WRAPPED_ETH)
                    if tx['to'] == wrapped_eth:
                        if f'WETH {wrapped_eth}' not in holdings:
                            holdings[f'WETH {wrapped_eth}'] = int(tx['value'])
                        else:
                            holdings[f'WETH {wrapped_eth}'] += int(tx['value'])

                        if f'WETH {wrapped_eth}' not in inflow_from_eoa:
                            inflow_from_eoa[f'WETH {wrapped_eth}'] = int(
                                tx['value'])
                        else:
                            inflow_from_eoa[f'WETH {wrapped_eth}'] += int(
                                tx['value'])

                        inflow = get_flow(tx, 'tx weth')
                        inflows.append(inflow)

                    if tx['to'] != "" and not account_is_organic(tx['to'], exchanges, bridges):
                        inflow_from_eoa[f"eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"] -= int(
                            tx['value'])
                        outflow = get_flow(tx, 'tx')
                        outflows.append(outflow)

                    holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(
                        tx['value'])

                # gas is payed even if tx fails
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] -= int(
                    tx['gasPrice']) * int(tx['gasUsed'])

            else:
                # is tx['from'] an EOA?
                if not account_is_organic(tx['from'], exchanges, bridges):
                    inflow_from_eoa[f"eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"] += int(
                        tx['value'])
                    inflow = get_flow(tx, 'tx')
                    inflows.append(inflow)
                holdings['eth 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] += int(
                    tx['value'])

    while len(timestamps) > count and int(sorted_txs[-1]['timeStamp']) > timestamps[count]:
        snapshot = take_snapshot(
            acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
        snapshots.append(snapshot)
        count += 1

    while len(timestamps) > count:
        snapshot = take_snapshot(
            acc, holdings, inflow_from_eoa, timestamps[count], inflows, outflows)
        snapshots.append(snapshot)
        count += 1

    return snapshots


def get_addresses():
    with connect_to_database() as (con, cur):
        cur.execute("select address from account;")
        rows = cur.fetchall()
        addresses = [row[0] for row in rows]
    return addresses


def main():

    exchanges = get_exchanges()
    bridges = get_bridges()

    addresses = get_addresses()
    # for acc in accs
    # only using accounts with less than 10k tx and or 10k ttes.
    for address in addresses[14:]:
        print(f"Currently working with: {address}")
        acc1 = EthAccount(address, APIKEY_ETHERSCAN)
        snapshots = get_snapshots(acc1, exchanges, bridges)
        print(f"Done with: {address}")


if __name__ == '__main__':
    main()
