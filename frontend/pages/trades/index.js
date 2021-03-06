import TradeTable from '../../components/TradeTable';
import { useState } from 'react';
import { ChevronIcon } from '../../components/shared/Icons';

export default function Trades() {
    return (
        <div className="content-container">
            <TextSection />
            <div className="grid grid-cols-4 gap-4 m-5">
                <TradeTable />
            </div>
        </div>
    );
}

const TextSection = () => {
    const [showText, setShowText] = useState(true);

    return (
        <section className="text-card-container">
            <h1 className="text-2xl text-black">listen for new trades by followed addresses</h1>
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
                by listening to a certain pair contract on a uniswap v2 DEX for Swap events, you can get notified
                whenever a trade happens. this is configured so that we only get notified when a account we care about
                makes a trade, and that is what's showing here. Go read on the analyze addresses page for more info
                about how addresses are picked and which addresses we are following here.
            </p>
            <p className="font-bold">why?</p>
            <p>
                could be nice to see what the smart money is up to. For example, it's probably interesting if an account
                we have deemed to be smart all of a sudden buys tons of a token that is not even listed on coingecko.
            </p>
            <br />
            <p>
                This table of trades is updated on page refresh, go to trades/livefeed for a real-time feed of new
                trades.
            </p>
        </div>
    );
};
