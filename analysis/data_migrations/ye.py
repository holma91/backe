import tweepy
import json
import re

text = 'hey you should all buy $jewel at $8, $cewel at $1 and maybe also $atom at $30.'

smart_money_regex = '\B\$[a-zA-z]+'

matches = re.findall(smart_money_regex, text)

print(matches)
