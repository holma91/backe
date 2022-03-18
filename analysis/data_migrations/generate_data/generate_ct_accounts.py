import json
import os
import tweepy
from dotenv import load_dotenv
load_dotenv('../.env')

bearer_token = os.environ.get('twitter_bearer_1')
client = tweepy.Client(bearer_token=bearer_token, wait_on_rate_limit=True)


def get_id_from_username(username):
    user = client.get_user(username=username)
    return user.data.id


ranked_accounts = ["blknoiz06",
                   "satsdart",
                   "dcfgod",
                   "HsakaTrades",
                   "DeFifrog1",
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
                   "0x_Messi",
                   "AltcoinPsycho",
                   "loomdart",
                   "AutismCapital",
                   "gainzxbt",
                   "CryptoKaleo",
                   "tarunchitra",
                   "DeFi_Brian",
                   "KeyboardMonkey3",
                   "pleyuh",
                   "Chubbicorn219",
                   "imBagsy",
                   "AviFelman",
                   "KanavKariya",
                   "CapitalGrug",
                   "Cryptoyieldinfo",
                   "transmissions11",
                   "tz_binance",
                   "bertcmiller",
                   "0xngmi",
                   "Mudit__Gupta",
                   "AlamedaTrabucco",
                   "cmsintern",
                   "lightcrypto",
                   "ASvanevik",
                   "icebergy_",
                   "DaRealMilkBagz",
                   "depression2019",
                   "Sicarious_",
                   "Route2FI",
                   "fishxbt",
                   "NaniXBT",
                   "twobitidiot",
                   "hosseeb",
                   "inversebrah",
                   "Tradermayne",
                   "CryptoCred",
                   "ledgerstatus",
                   "bitcoinpanda69",
                   "LomahCrypto",
                   "IamNomad",
                   "HentaiAvenger69",
                   "MoonOverlord",
                   "KyleLDavies",
                   "_krutches",
                   "mattigags",
                   "zhusu",
                   "0xtuba",
                   "0xSisyphus",
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
