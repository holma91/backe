# Root

vad försöker jag göra?

4 olika repos

-   /analysis
-   /backend
-   /bots
-   /frontend

### Analysis

-   Analysera addresser
    -   sparar addresser av intresse och sätter en label på dom
    -   bygger upp en databas med dessa addresser och information om dem

### Bots

-   On-chain bots
    -   detta är bottarna som härjar på blockkedjorna, exempel på vad de gör/ska göra är
        -   lyssna på olika DEXes när nya par skapas
        -   analysera en token utifrån all information som är tillgänglig när den skapas
        -   lyssna på olika addresser för att se vad de köper och säljer
        -   köpa och sälja automatiskt utifrån analysen ovan (kommer endast gå i vissa fall, men målet är att automatisera så mycket som möjligt)
            -   exempelscenario: Vi har en adress som enligt våra uträkningar har dessa stats:
                active_since = 2017
                profit_usd = $100m
                current_account_value_usd = $10m
                Vi har också information om att denna adress har varit framgångsrik på över 5 olika kedjor (tyder på att det inte är någon val som endast köpte eth 2015 och är rik pga det). Våran bot får nu en notis om att denna adress har köpt en token med ett market cap på $10m och en simpel slutsats man kan dra är att detta med stor sannolikhet är något man bör copytradea. (inte ovanligt att tokens i denna storlek kan gå upp 10x på en vecka)
        -   generera ett feed för frontenden med allt som händer på blockkedjorna vi följer (ska vara i real-time)
            -   detta är bland annat hjälpsamt i de fallen där köpandet/säljandet ej går att automatisera och manuell analys måste göras. Till exempel i exempelscenariot ovan kan det vara nice att göra research (kolla twitter, deras hemsida etc) innan man köper.
-   Off-chain bots
-   information bots

### backend

En API som exponerar databasen med addresser

### frontend

Först och främst en dashboard som visar vad som försiggår i databasen, men även som visar vad som försiggår on-chain rent generellt också.
