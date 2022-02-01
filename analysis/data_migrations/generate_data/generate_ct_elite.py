import json
import tweepy
from twitter_env import BEARER_TOKEN_1

client = tweepy.Client(bearer_token=BEARER_TOKEN_1, wait_on_rate_limit=True)


def get_id_from_username(username):
    user = client.get_user(username=username)
    return user.data.id


ranked_accounts = ["blknoiz06",
                   "satsdart",
                   "dcfgod",
                   "HsakaTrades",
                   "DeFiGod1",
                   "Fiskantes",
                   "gametheorizing",
                   "AutomataEmily",
                   "mewn21",
                   "ceterispar1bus",
                   "mrjasonchoi",
                   "Darrenlautf",
                   "DegenSpartan",
                   "Tetranode",
                   "TaikiMaeda2",
                   "Pentosh1",
                   "mgnr_io",
                   "cmsholdings",
                   "GiganticRebirth",
                   "ZeMariaMacedo",
                   "danielesesta",
                   "AlgodTrading",
                   "CryptoMessiah",
                   "AltcoinPsycho",
                   "loomdart",
                   "AndreCronjeTech",
                   "jebus911",
                   "CryptoKaleo",
                   "gainzxbt",
                   "inversebrah",
                   "Tradermayne",
                   "CryptoCred",
                   "ledgerstatus",
                   "bitcoinpanda69",
                   "LomahCrypto",
                   "IamNomad",
                   "lightcrypto",
                   "HentaiAvenger69",
                   "MoonOverlord",
                   "KyleLDavies",
                   "_krutches",
                   "mattigags",
                   "zhusu",
                   "0xtuba",
                   "0xSisyphus",
                   "tztokchad",
                   "tz_binance",
                   "icebergy_",
                   "DaRealMilkBagz",
                   "depression2019",
                   "Sicarious_",
                   "Route2FI",
                   "fishxbt",
                   "NaniXBT",
                   "ercwl",
                   "twobitidiot",
                   "hosseeb"
                   ]

final = {}

for acc in ranked_accounts:
    try:
        twitter_id = get_id_from_username(acc)
        final[acc] = str(twitter_id)
    except Exception as e:
        print(acc)
        print(e)

print(json.dumps(final, indent=2))
