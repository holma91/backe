import { AnalyzeTwitterTableMentions, AnalyzeTwitterTableTokens } from '../../components/AnalyzeTwitterTable';
import { useState } from 'react';
import { ChevronIcon } from '../../components/shared/Icons';

export default function Home() {
    const [showMentionsTable, setShowMentionsTable] = useState(true);
    const [showTokensTable, setShowTokensTable] = useState(true);
    return (
        <div className="content-container">
            <TextSection />
            <div className=" mr-5 ml-5 mb-5">
                <button
                    onClick={() => setShowTokensTable(!showTokensTable)}
                    className="flex font-bold mt-2 text-lg ml-5"
                >
                    <ChevronIcon expanded={showTokensTable} /> table with a token for every row
                </button>
                {showTokensTable ? <AnalyzeTwitterTableTokens /> : null}

                <button
                    onClick={() => setShowMentionsTable(!showMentionsTable)}
                    className="flex font-bold mt-2 text-lg ml-5"
                >
                    <ChevronIcon expanded={showMentionsTable} /> table with a mention for every row
                </button>
                {showMentionsTable ? <AnalyzeTwitterTableMentions /> : null}
            </div>
        </div>
    );
}

const TextSection = () => {
    const [showText, setShowText] = useState(true);

    return (
        <section className="text-card-container">
            <h1 className="text-2xl text-black">analyze mentions of tickers on twitter</h1>
            <button onClick={() => setShowText(!showText)} className="flex font-bold mt-2 text-lg">
                <ChevronIcon expanded={showText} /> how and why?
            </button>
            {showText ? <TextCard /> : null}
        </section>
    );
};

const TextCard = () => {
    return (
        <div className="text-card">
            <p className="font-bold">how?</p>
            <p className="pl-4">1. 100 accounts are handpicked that are deemed "good"</p>
            <p className="pl-4">
                2. a list is created with all these accounts plus all the accounts they follow (around 15k accounts in
                total)
            </p>
            <p className="pl-4">3. all their previous tweets the last 7 days are retrieved and saved into a hashmap</p>
            <p className="pl-4">
                4. now it's possible to easily see what has been mentioned by somewhat respectable accounts during the
                last 7 days
            </p>
            <br />
            <p>
                There are some problems, mainly the fact that the twitter API only lets you retrieve data from the last
                7 days if you don't have a "research account" which from the looks of it is difficult to get. Could get
                around by running this script once a week and save up the data from now on, but the historical data
                would then of course never be included. The 100 or so handpicked twitter accounts can be found here
                <a
                    className="ml-1 text-blue-600 hover:text-blue-400"
                    href="https://github.com/holma91/backe/tree/main/analysis/handpicked_twtaccs.txt"
                    target={'_blank'}
                >
                    github.com/holma91/backe/tree/main/analysis/handpicked_twtaccs.txt
                </a>{' '}
            </p>
            <p className="font-bold">why?</p>
            <p>
                If the historical data is somehow retrievable, I think you could do some interesting analysis if you
                combine the twitter mentions together with market data.
            </p>
        </div>
    );
};
