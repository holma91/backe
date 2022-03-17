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
            <p>
                first of all an address needs to be found, and that can be done by for example looking at volume,
                looking at early investors in successful tokens, taking help of nansen.ai etc. when an address is found,
                the analysis goes like this:
            </p>
        </div>
    );
};
