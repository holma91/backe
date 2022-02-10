import json

from utils.env import APIKEY_ETHERSCAN
from utils.helpers import fix_address, get_account_type
from utils.db_utils import connect_to_database
from utils.json_load import get_exchanges, get_bridges, get_accounts


def account_is_interesting(accounts, address, exchanges, bridges):
    # cba to regex this shit
    return not('pool' in accounts[address].lower() or 'router'
               in accounts[address].lower() or 'factory' in accounts[address].lower()
               or 'token' in accounts[address].lower()
               or address in exchanges or address in bridges)


def main():
    exchanges = get_exchanges()
    bridges = get_bridges()
    accounts = get_accounts()
    # Connect to DB
    with connect_to_database() as (con, cur):
        con.autocommit = True
        generated_accounts = []

        # generate EOAs with less than 10k txs and 10k ttes
        for address in accounts.keys():
            try:
                cur.execute("""select * from account where address = %s""",
                            (fix_address(address), ))
                rows = cur.fetchall()
                if len(rows) == 1:
                    continue  # Account already in DB

                if not account_is_interesting(accounts, address, exchanges, bridges):
                    continue

                account = {
                    "address": fix_address(address),
                    "label": accounts[address]
                }

                cur.execute("""select * from account where address = %s""",
                            (account['address'], ))
                rows = cur.fetchall()

                if len(rows) == 1:
                    # account already in DB
                    continue

                cur.execute("insert into account (address) values (%s);",
                            (fix_address(account['address']),))

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
