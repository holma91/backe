import AnalyzeTable from './AnalyzeTable';
import { useState } from 'react';
import { ChevronIcon } from '../../components/shared/Icons';

export default function Home() {
    return (
        <div className="content-container">
            <TextSection />
            <div className="grid grid-cols-4 gap-4 mr-5 ml-5 mb-5">
                <AnalyzeTable />
            </div>
        </div>
    );
}

const TextSection = () => {
    const [showText, setShowText] = useState(true);

    return (
        <section className="text-card-container">
            <h1 className="text-2xl text-black">listen for new liquidity pairs</h1>
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
            <h1 className="text-2xl text-black">analyze addresses</h1>
            <p className="font-bold">how?</p>
            <p>
                first of all an address needs to be found, and that can be done by for example looking at volume,
                looking at early investors in successful tokens, taking help of nansen.ai etc. when an address is found,
                the analysis goes like this:
            </p>
            <p>
                (a prerequisite to this is that I have built up a database table with all tokens on coingecko with a
                snapshot of what the tokens price was on any given day, this is so that I can ask my db for this data
                instead of having to get rate limited to death by cg)
            </p>
            <p className="pl-4">
                1. retrieve all transactions, erc20 transfer events and internal transfers from this address (from
                etherscan)
            </p>
            <p className="pl-4">
                2. retrieve all known addresses of exchanges and bridges. this is super important because when
                determining profitability, we for example don't want to count a transfer to a bridge as a losing trade
                or a deposit from an exchange as a winning trade
            </p>
            <p className="pl-4">
                3. go through all transactions from the ground up and for every day, take a snapshot of the account's
                state (all it's balances in this case) together with the value for each token balance in usd (with the
                help of historical coingecko data)
            </p>
            <p className="pl-4">
                4. we now have a snapshot of the account's state for any given day, and by comparing the snapshots we
                can retrieve info such as profitability and activity
            </p>
            <p className="font-bold">why?</p>
            <p>
                finding addresses that are profitable could be a source for some good alpha, e.g you could set up a bot
                that copy trades, you could try to frontrun or you could just try to analyze what good addresses are
                doing.
            </p>
            <br />
            <p>
                the 100 or so addresses that are on display here have been chosen mainly by studying the addresses with
                highest volume. the code for the analysis can be found here
                https://github.com/holma91/backe/tree/main/analysis/data_migrations
            </p>
        </div>
    );
};
