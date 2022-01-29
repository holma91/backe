import re
import tweepy

from utils.env import BEARER_TOKEN_1, BEARER_TOKEN_2, BEARER_TOKEN_3
from utils.db_utils import connect_to_database


c


def insert_ticker_mentions(username, count, clients, cur):

    query = f'from:{username} -is:retweet'
    ticker_regex = '\B\$[a-zA-z]+'
    idx = 0
    if count < 5:
        idx = 0
    elif count < 10:
        idx = 1
    else:
        idx = 2
    client = clients[idx]

    try:
        for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,
                                      tweet_fields=['created_at'],
                                      expansions='author_id', max_results=100).flatten(limit=1000):

            matches = re.findall(ticker_regex, tweet.text)
            for match in matches:
                cur.execute("insert into ticker_mention (tweet_id, user_id, ticker, tweet_timestamp) values (%s, %s, %s, %s);",
                            (tweet.id, tweet.author_id, match.lower(), str(tweet.created_at)))
    except Exception as e:
        print(f'error with {username}')
        print(e)


def get_usernames():
    with connect_to_database() as (_, cur):
        cur.execute("select username from twitter_account;")
        rows = cur.fetchall()
    usernames = [row[0] for row in rows]
    return usernames


def main():

    # multiple clients because of twitter rate limiting
    client1 = tweepy.Client(bearer_token=BEARER_TOKEN_1,
                            wait_on_rate_limit=True)
    client2 = tweepy.Client(bearer_token=BEARER_TOKEN_2,
                            wait_on_rate_limit=True)
    client3 = tweepy.Client(bearer_token=BEARER_TOKEN_3,
                            wait_on_rate_limit=True)
    clients = [client1, client2, client3]

    usernames = get_usernames()

    count = 0
    with connect_to_database() as (con, cur):
        con.autocommit = True
        for username in usernames:
            insert_ticker_mentions(username, count, clients, cur)
            count += 1
            if count >= 15:
                count = 0


if __name__ == '__main__':
    main()