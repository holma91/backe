import json
import psycopg2

from utils.env import APIKEY_ETHERSCAN
from utils.helpers import fix_address, get_account_type
from utils.EthAccount import EthAccount

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

# autocommit because if we get an error halfway we through,
# the first half should still be inserted to the db
con.autocommit = True
cur = con.cursor()

with open('./initial_data/exchanges.json', 'r') as exchanges_file:
    data = exchanges_file.read()

exchanges = json.loads(data)
exchanges = [exchange['address'] for exchange in exchanges]

with open('./initial_data/bridges.json', 'r') as bridges_file:
    data = bridges_file.read()

bridges = json.loads(data)
bridges = [bridge['address'] for bridge in bridges]

with open('./dump_data/addresses.json', 'r') as f:
    data = f.read()

accounts = json.loads(data)

generated_accounts = []
whale_file = open("./dump_data/whales.txt", "a")
# generate EOAs with less than 10k txs and 10k ttes
for address in accounts.keys():
    try:
        print(address)
        cur.execute("""select * from account where address = %s""",
                    (fix_address(address), ))
        rows = cur.fetchall()
        if len(rows) == 1:
            # account already in DB
            continue
        # check if CA
        account_type = get_account_type(address)
        if account_type == 'CA' or address in exchanges or address in bridges:
            # we only care about EOAs that are not bridges or exchanges
            continue

        ethAcc = EthAccount(address, APIKEY_ETHERSCAN)
        if len(ethAcc.get_transactions()) >= 10000 or len(ethAcc.get_ERC20_token_transfer_events()) >= 10000:
            # can't handle the huge accounts with etherscan
            # save as whale account
            whale_file.write(f"{fix_address(address)}\n")
            continue

        account = {
            "address": fix_address(address),
            "label": accounts[address],
            "account_type": "EOA"
        }

        cur.execute("""select * from account where address = %s""",
                    (account['address'], ))
        rows = cur.fetchall()
        if len(rows) == 1:
            # account already in DB
            continue

        cur.execute("insert into account (address, account_type) values (%s, %s);",
                    (fix_address(account['address']), account['account_type']))

        if account['label'] != '' and account['label'] != 'no label':
            cur.execute("insert into account_label (address, label_id) values (%s, %s);",
                        (account['address'], account['label']))

        generated_accounts.append(account)
    except Exception as e:
        print(f'exception at {address}')
        print(e)
        continue


print(json.dumps(generated_accounts, indent=2))
cur.close()
con.close()
whale_file.close()
