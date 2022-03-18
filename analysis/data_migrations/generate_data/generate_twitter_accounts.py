import json
import os
import tweepy
from dotenv import load_dotenv
load_dotenv('../.env')

bearer_token1 = os.environ.get('twitter_bearer_1')
bearer_token2 = os.environ.get('twitter_bearer_2')
bearer_token3 = os.environ.get('twitter_bearer_3')

# worthy twitter accounts
accounts = ["blknoiz06",
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

client1 = tweepy.Client(bearer_token=bearer_token1, wait_on_rate_limit=True)
client2 = tweepy.Client(bearer_token=bearer_token2, wait_on_rate_limit=True)
client3 = tweepy.Client(bearer_token=bearer_token3, wait_on_rate_limit=True)
clients = [client1, client2, client3]


def get_id_from_username(username, client):
    user = client.get_user(username=username)
    return user.data.id


def get_following(username, client, followees={}):
    user_id = get_id_from_username(username, client)
    followee = client.get_users_following(user_id, max_results=1000)
    for followees_page in tweepy.Paginator(client.get_users_following, id=user_id, max_results=1000):
        for followee in followees_page.data:
            if followee.id in followees.keys():
                followees[followee.id]['followers'].append(username)
            else:
                followees[followee.id] = {
                    'username': followee.username,
                    'followers': [username]
                }

    return followees


def get_interesting_accounts(usernames):
    accounts = {}
    for count, username in enumerate(usernames):
        try:
            accounts = get_following(username, clients[count % 3], accounts)  # alternate clients to avoid rate limiting
        except Exception as e:
            print(f"error with {username}: {e}")

    return accounts


def get_tweets(username):
    query = f'from:{username} -is:retweet'

    tweets = []
    for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,
                                  tweet_fields=['created_at'],
                                  expansions='author_id', max_results=100).flatten(limit=1000):
        tweet_obj = {
            'author_id': tweet.author_id,
            'created_at': str(tweet.created_at),
            'tweet_id': tweet.id,
            'text': tweet.text
        }
        tweets.append(tweet_obj)

    return tweets


print(json.dumps(get_interesting_accounts(accounts), indent=2))
# python twitter.py > accounts.json
