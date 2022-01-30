import requests
import os
import json
from env import BEARER_TOKEN_1, BEARER_TOKEN_2, BEARER_TOKEN_3

# To set your enviornment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = BEARER_TOKEN_2  # os.environ.get("BEARER_TOKEN")


def bearer_oauth(r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2FilteredStreamPython"
    return r


def get_rules():
    response = requests.get(
        "https://api.twitter.com/2/tweets/search/stream/rules", auth=bearer_oauth
    )
    if response.status_code != 200:
        raise Exception(
            "Cannot get rules (HTTP {}): {}".format(response.status_code, response.text)
        )
    return response.json()


def delete_all_rules(rules):
    if rules is None or "data" not in rules:
        return None

    # ids of the old rules
    ids = list(map(lambda rule: rule["id"], rules["data"]))
    payload = {"delete": {"ids": ids}}
    # deleting the old rules
    response = requests.post(
        "https://api.twitter.com/2/tweets/search/stream/rules",
        auth=bearer_oauth,
        json=payload
    )
    if response.status_code != 200:
        raise Exception(
            "Cannot delete rules (HTTP {}): {}".format(
                response.status_code, response.text
            )
        )


def set_rules():
    # You can adjust the rules if needed
    sample_rules = [
        {"value": '(from:labacke) OR (from:satsdart) OR (from:blknoiz06)'},
        # {"value": 'from:satsdart -is:retweet'},
        # {"value": 'from:blknoiz06 -is:retweet'},
    ]
    payload = {"add": sample_rules}
    response = requests.post(
        "https://api.twitter.com/2/tweets/search/stream/rules",
        auth=bearer_oauth,
        json=payload,
    )
    if response.status_code != 201:
        raise Exception(
            "Cannot add rules (HTTP {}): {}".format(response.status_code, response.text)
        )
    print(json.dumps(response.json()))


def get_stream():
    response = requests.get(
        "https://api.twitter.com/2/tweets/search/stream", auth=bearer_oauth, stream=True,
    )
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(
            "Cannot get stream (HTTP {}): {}".format(
                response.status_code, response.text
            )
        )
    for response_line in response.iter_lines():
        if response_line:
            json_response = json.loads(response_line)
            print(json.dumps(json_response, indent=4, sort_keys=True))


def main():
    rules = get_rules()
    delete_all_rules(rules)
    set_rules()
    get_stream()


if __name__ == "__main__":
    main()


# rules = {'data': [{'id': '1486045434397270025', 'value': 'dog has:images', 'tag': 'dog pictures'}, {'id': '1486045434397270026',
#                                                                                                     'value': 'cat has:images -grumpy', 'tag': 'cat pictures'}], 'meta': {'sent': '2022-01-25T18:41:01.421Z', 'result_count': 2}}
