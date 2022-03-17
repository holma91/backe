# Overview

the project is basically in four parts

-   /analysis
-   /bots
-   /backend
-   /frontend

architecture
![alt text](architecture.png)

## Analysis

The flow should be: receive address, analyze the address, save the address if it's deemed interesting. Example of stuff that we can analyze on an address:

-   profitability
    -   in total since the account was "created", but also during certain periods. E.g. it could be interesting too see which accounts were profitable during the last long bear period.
    -   how has the address been profitable? tokens? NFTs? memecoins? is it a trader? a dev? There are many alternatives, and it's without a doubt interesting too see what the "profile" of an account is.
-   connections
    -   what other addresses is this address connected to? what tokens? what nfts? etc.
    -   what other chains are this address connected to (Could be interesting)? It's ofc easy to follow accounts across bridges on evm-compatible chains, but it should also be possible to for example connect a NEAR address with a ETH address.
-   portfolio
    -   what has this address been holding during years? what is it holding right now?

Analyzing the profitability is the hard part since you can never be sure if you have labelled all exchanges and bridges, and you could also probably be spoofed by the address if the owner tried.

## Bots

### on-chain

Scripts that run on different blockchains. The goal is to get a good view over what is happening before others.

Currently two bots/scripts running:

-   lpBot.js (on most EVM chains)
    listens to all newly emitted newPair events, and sends a post request to the server who in turn sends it to the frontend and the discord server.
-   swapBot.js (on ethereum mainnet)
    -   listens for emitted Swap events from a set of followed liquidity pairs. When receiving a swap event, it checks the senderAddress against our saved addresses and proceeds if the sender is interesting. The liquidity pairs we are listening to have been chosen pretty arbitrarily so far apart from the the new ones that notifies the lpBot.

TODO: - mev stuff?

### off-chain

Mainly have different kind of social media information bots in mind.

-   twitterbot (not running but kinda works)
    works like this:
    1. handpick 100 accounts that are deemed "good"
    2. create a list of all the accounts that these 100 accounts follow (is around 15k accounts)
    3. check all their previous tweets and save everything into a hashmap
    4. we can now see easily what has been mentioned the most by somewhat respectable accounts and our data is not ruined by spambots.
       There are some problems, mainly the fact that the twitter API only lets you retrieve data from the last 7 days if you don't have a "research account" which from the looks of it is difficult to get. Could get around by running this script once a week and save up the data from now on, but the historical data would then of course never be included. If the historical data is somehow retrievable, I think you could do some really interesting analysis if you combine the twitter shilling together with market data.

## Backend

A node.js REST API that exposes what's inside the postgres DB. Everything the bots "receive" goes through the node server before being inserted to the DB. On receving stuff, the server also sends out messages to both the web client and a discord server.

## Frontend

### web client

A react.js (next.js) app that acts like a dashboard for everything else. Not much else going on there.

### discord server

Thought a discord server would be nice to have as a frontend as well, since you integrate notifications and stuff super easy.
