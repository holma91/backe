# on-chain stuff

### evm chains

-   listen to when new liquidity pairs are added - DONE (on evm chains)
-   listen to address movements - IN PROGRESS
    -   works on ethereum
    -   set it up on the other evm chains
-   do everything for erc-721 tokens as well (NFTs) - NOT STARTED
    -   research the whole nft space first. Not even confident in taking trades here yet.
-   bots that can buy stuff automatically - need to have a list of requirements that can be checked programmatically, the so called rug detector. - need to research previous releases to see what charactherizes a good release. That it's not a rug is not enough.

### cosmos-sdk chains

-   basically the same stuff as on the evm chains - NOT STARTED
    -   need to research everything about cosmos and IBC before

### mev stuff

-   develop mev-bots - NOT STARTED
    -   dive deeper into the EVM and solidity at first
    -   somewhat simple arbitrage bots on single evm-chains could be the first step.
    -   cross-chain arbitrage bots could be the next step, first on multiple evm-chains and then evm and non-evm chain.

# social media

### twitter

-   take in all tweets from followed accounts once a week - DONE
-   follow these accounts in real-time - IN PROGRESS
    -   problem with twitters api here, don't have a great solution yet. The best idea right now is to sign up to ca. 20 twitter developer accounts with "elevated access". Maybe a better solution is to just scrape a frontend?
-   do some data analysis on all this data - NOT STARTED
    -   compare mentions of certain projects with their price development. Unfortunately the api does not provide access to tweets older than 7 days. A solution could be to instead scrape a twitter frontend? either twitter.com or something like nitter.io, not sure how difficult this would be.
-   listen to tweets from exchange accounts to see if they are listing a new token - NOT STARTED
    -   the obvious next step here is to frontrun retail by buying the token on a dex when it's tweeted

### discord

-   write a "frontend" for the stuff that I'm tracking - DONE
-   a wonderful thing would be to track and analyze crypto discord servers in the same way as we are tracking twitter. Unfortunately, I don't even think this is allowed by discord so.

### reddit

-   track and analyze all posts and comments from chosen crypto subs - NOT STARTED
    -   keep in mind that reddit is not a place for alpha in the same way as twitter in crypto (or discord), not even close. Therefore twitter is prioritized. Could still be interesting do analyze historical data. Haven't explored reddit's api yet, it's possible that the full archive is available.

# Backend

Not much "innovative" work to be done here. Except for setting up data pipelines later that updates the database regularly through the day, but this is not a priority at all atm. Node js server with express. Postgres database.

-   set up an api that exposes the database - IN PROGRESS
-   deploy to production (not in a hurry at all) - NOT STARTED
    -   how?
        -   just a basic VM on digital ocean?
        -   or docker stuff?

# Frontend

The frontend should only have one job from the beginning, and that is to just to show everything that is in the database. Design is not a focus at the moment so it's better to just not try hard there since whatever we do now I'm gonna want to completely redesign it later. The goal right now is therefore, a pretty barebones website that just exposes everything that is in the DB. Of course possible to do everything with dummy data first so the frontend development is not slowed down by the progress on the backend. My priority is not on the frontend right now mainly because it's not gonna provide any short-term trading edge compared to the other stuff (the discord server is a decent frontend already). What to do:

-   show stuff on the frontend - NOT STARTED
    -   accounts
        -   follow what accounts are doing in real-time
    -   tokens
        -   real-time data
    -   visualize the data
        -   maybe learn D3 if the time shows up

tech stack: react with next.js and tailwind

## DONE

-   listen to when new liquidity pairs are added - DONE (on evm chains)
-   take in all tweets from followed accounts once a week - DONE
-   write a "frontend" (discord server) for the stuff that I'm tracking - DONE

## IN PROGRESS

-   listen to address movements - IN PROGRESS
-   develop bots that can buy tokens - IN PROGRESS
-   follow twitter accounts in real-time - IN PROGRESS
-   set up an api that exposes the database - IN PROGRESS

## NOT STARTED

-   do everything for erc-721 tokens as well (NFTs) - NOT STARTED
-   do the same stuff on cosmos as on the evm chains - NOT STARTED
-   develop mev-bots - NOT STARTED
-   do some data analysis on twitter data - NOT STARTED
-   listen to tweets from exchange accounts to see if they are listing a new token - NOT STARTED
-   track and analyze all posts and comments from chosen reddit subs - NOT STARTED
-   show stuff on the frontend - NOT STARTED

# what i'm doing right now

1. finish the tracking of addresses on evm chains.

### then, not in a specific order:

-   track twitter addresses in real-time
-   dive into nfts and do the related tasks
-   dive into cosmos and do the related tasks
-   dive into the evm, solidity and MEV
-   make some decisions in analysis, and do the analysis on all collected addresses
-   finish the tax software for all evm chains

# LATER

-   rewrite all javascript in typescript. Why? because types > no types. Why not right now? Not a priority
