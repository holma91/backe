väljer alla vettiga konton från twitter samt alla dom följer. Kolla alla deras tweets (ex från jan 2021 till nu), spara alla tokens som har nämnts i tweets samt hur många gånger de har nämnts. Vi har nu en hashmap med alla tokens som någonsin har nämnts av dessa konton (som enligt bedömningen är vettiga) och kan nu lyssna på twitter efter tokens som dessa konton aldrig har nämnt (om ingen av dessa konton har nämnt en token så är man med nästan all sannolikhet tidig). Lyssnandet bör göras inte bara på denna grupp av vettiga konton och dom som dom följer, utan även på de som följer dessa vettiga konton. (jättemycket shitcoins kommer dyka upp ja, men även vettiga saker)

## MVP

-   choose 10 twitter accounts
-   make a list of the 10 accounts and everyone they're following
-   go through all their tweets since november 1st 2021
-   index all words, e.g if yo occurs 115 times and algo 40 times: {'yo': 115, 'algo': 40}
-   listen to new words from these accounts and compare to the database

### TODO

-   get tweets from accounts
-   listen to tweets from accounts

### Accounts

what accounts and their followees do i think have the most alpha? (in alts)
ranked by myself

1.  blknoiz06
    satsdart
    dcfgod
    HsakaTrades

2.  DeFiGod1
    Fiskantes
    gametheorizing
    AutomataEmily
    mewn21
    ceterispar1bus
    mrjasonchoi
    Darrenlautf
    DegenSpartan
    Tetranode
    TaikiMaeda2
    Pentosh1
    mgnr_io
    cmsholdings
    GiganticRebirth
    ZeMariaMacedo
    danielesesta
    AlgodTrading
    CryptoMessiah
    AltcoinPsycho
    loomdart
    AndreCronjeTech
    jebus911
    CryptoKaleo

take all the followees of these account. Save all the followees that are followed by 3 or more of these accounts. - DONE
go through all tweets from these accounts

STEPS:

1. get all recent tweets from account
2. search for words starting with $. if hit -> insert into DB

ALTERNATIVES
possible to stream everything from 15k accounts, but in a really hacky way... Might need 20 elevated dev accounts to do so.
or
batch retrieve everything once a week.
