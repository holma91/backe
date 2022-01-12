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
            -   exempelscenario: Vi har en adress som enligt våra uträkningar har dessa stats (bland annat):
                active_since = 2017
                profit_usd = $100m
                current_account_value_usd = $10m
                Vi har också information om att denna adress har varit framgångsrik på över 5 olika kedjor (tyder på att det inte är någon val som endast köpte eth 2015 och är rik pga det). Våran bot får nu en notis om att denna adress har köpt en token med ett market cap på $10m och en simpel slutsats man kan dra är att detta med stor sannolikhet är något man bör copytradea. (inte ovanligt att tokens i denna storlek kan gå upp 10x på en vecka)
        -   generera ett feed för frontenden med allt som händer på blockkedjorna vi följer (ska vara i real-time)
            -   detta är bland annat hjälpsamt i de fallen där köpandet/säljandet ej går att automatisera och manuell analys måste göras. Till exempel i exempelscenariot ovan kan det vara nice att göra research (kolla twitter, deras hemsida etc) innan man köper. (såklart hade det varit nice om man lyckas automatisera även detta)
-   Off-chain bots
    -   bots som tradear på exchanges (coinbase, binance, kraken etc).
    -   ytterst tveksamt om detta ens är värt det, barrier to entry är låg (enkelt att göra dessa bottar) och det finns bara större tokens tillgängliga. Skulle tro att edgen man kan få här jämfört med on-chain bottar inte ens är en tiondel.
-   information bots
    -   bots som har syftet att bara leta internet för information gällande tokens.
    -   twitter
        -   exempeltillämpning:
            väljer alla vettiga konton från twitter samt alla dom följer. Kolla alla deras tweets (ex från jan 2021 till nu), spara alla tokens som har nämnts i tweets samt hur många gånger de har nämnts. Vi har nu en hashmap med alla tokens som någonsin har nämnts av dessa konton (som enligt bedömningen är vettiga) och kan nu lyssna på twitter efter tokens som dessa konton aldrig har nämnt (om ingen av dessa konton har nämnt en token så är man med nästan all sannolikhet tidig). Lyssnandet bör göras inte bara på denna grupp av vettiga konton och dom som dom följer, utan även på de som följer dessa vettiga konton. (jättemycket shitcoins kommer dyka upp ja, men även vettiga saker och om man kan frontrunna twitter är det något man bör göra)
    -   discord
        -   exempeltillämpning:
            bots som är kryptorelaterade discords och som dels kan göra liknande saker som i twitterexemplet, men även till exempel analysera i vilka kanaler som det är mesta aktivitet i. Till exempel, om en discord har 10 kanaler för olika blockkedjor och vi ser att en stor del av diskussionen rör sig till en någorlunda ny kedja så kan slutsatsen dras att folk är intresserade av denna kedja och då är det nog fördelaktigt att sätta upp bottar som lyssnar på denna nya kedja.
    *   och massor mer

### backend

En API som exponerar databasen med addresser

### frontend

Först och främst en dashboard som visar vad som försiggår i databasen, men även som visar vad som försiggår on-chain rent generellt också.
