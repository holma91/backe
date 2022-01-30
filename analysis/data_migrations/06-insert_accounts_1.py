import json

from utils.env import APIKEY_ETHERSCAN
from utils.helpers import fix_address, get_account_type
from utils.db_utils import connect_to_database
from utils.json_load import get_exchanges, get_bridges, get_accounts


def main():
    exchanges = get_exchanges()
    bridges = get_bridges()
    accounts = get_accounts()
    # Connect to DB
    with connect_to_database() as (con, cur):
        con.autocommit = True
        generated_accounts = []
        # whale_file = open("./dump_data/whales.txt", "a")
        with open("./dump_data/whales.txt", "a") as whale_file:
            # generate EOAs with less than 10k txs and 10k ttes
            for address in accounts.keys():
                try:
                    print(address)
                    cur.execute("""select * from account where address = %s""",
                                (fix_address(address), ))
                    rows = cur.fetchall()
                    if len(rows) == 1:
                        continue  # Account already in DB

                    # check if CA
                    account_type = get_account_type(address)
                    if account_type == 'CA' or address in exchanges or address in bridges:
                        continue  # we only care about EOAs that are not bridges or exchanges

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


if __name__ == '__main__':
    main()
