import json
import tweepy

from env import BEARER_TOKEN_1, BEARER_TOKEN_2
# "$jewel" until:2021-10-15 since:2021-09-30
# worthy twitter accounts
accounts = ["blknoiz06",
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

client = tweepy.Client(bearer_token=BEARER_TOKEN_1, wait_on_rate_limit=True)


def get_id_from_username(username):
    user = client.get_user(username=username)
    return user.data.id


def get_following(username, followees={}):
    user_id = get_id_from_username(username)
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
    try:
        for username in usernames:
            accounts = get_following(username, accounts)
    except Exception as e:
        print(e)
        print(json.dumps(accounts, indent=2))

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


# print('yo')
# print(json.dumps(get_following('satsdart'), indent=2))
# print(json.dumps(get_interesting_accounts(accounts), indent=2))
print(json.dumps(get_tweets('satsdart')))
# python twitter.py > accounts.json
