import { useState } from 'react';
import PairTable from '../../components/PairTable';
import { ChevronIcon } from '../../components/shared/Icons';

export default function Pairs() {
    return (
        <div className="content-container">
            <TextSection />
            <div className="grid grid-cols-4 gap-4 mr-5 ml-5 mb-5">
                <PairTable />
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
            <p className="font-bold">how?</p>
            <p>
                by listening to the "factory contract" on a dex (that is a uniswap V2 fork), you can get notified every
                time someone adds a new pair (which often indicates a new token) by listening for emitted "newPair
                events".
            </p>
            <p className="font-bold">why?</p>
            <p>
                could be nice to see what gets added during periods of high activity, for example during 2021 it was
                profitable to just look for new tokens on every evm-compatible chain that launched.
            </p>
            <br />
            <p>
                This table of pairs is updated on page refresh, go to pairs/livefeed for a real-time feed of new pairs.
            </p>
        </div>
    );
};
