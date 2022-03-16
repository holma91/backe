import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function LiveFeed() {
    const [pairs, setPairs] = useState([]);
    const [isConnectionOpen, setConnectionOpen] = useState(false);

    const ws = useRef();

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            setConnectionOpen(true);
        };

        ws.current.onmessage = (ev) => {
            const pair = JSON.parse(ev.data);
            setPairs((_pairs) => [pair, ..._pairs]);
            console.log(pair);
        };

        return () => {
            ws.current.close();
            setConnectionOpen(false);
        };
    }, []);

    const pair = {
        chain: 'BSC',
        createdAt: '2022-03-15T12:01:52.000Z',
        dex: 'pancakeswap',
        id: 4369,
        liquidityUsd: '0',
        pairAddress: '0xb9172355b160312d844a6abb4806832abd5a1cd1',
        token0Address: '0x778f59fa2a99de921157a5f19751dd8fd05072be',
        token0Decimals: '18',
        token0Name: 'COMO',
        token0Symbol: 'COM',
        token1Address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        token1Decimals: '18',
        token1Name: 'Wrapped BNB',
        token1Symbol: 'WBNB',
        updatedAt: '2022-03-15T12:01:53.079Z',
    };

    return (
        <div className="content-container">
            <section className="text-card">
                <h1 className="text-2xl text-black">listen for new liquidity pairs</h1>
                <p className="font-bold">how?</p>
                <p>
                    by listening to the "factory contract" on a dex (that is a uniswap V2 fork), you can get notified
                    every time someone adds a new pair (which often indicates a new token) by listening for emitted
                    "newPair events".
                </p>
                <p className="font-bold">why?</p>
                <p>
                    could be nice to see what gets added during periods of high activity, for example during 2021 it was
                    profitable to just look for new tokens on every evm-compatible chain that launched.
                </p>
                <br />
                <p>
                    this is just a feed with json blobs of newly added pairs, go to pairs/all-pairs for more historical
                    data and a more structured design.
                </p>
            </section>

            {pairs.map((pair) => (
                <div className="message-container">
                    <pre>{JSON.stringify(pair, undefined, 2)}</pre>
                </div>
                // <div className="pair-card">
                //     <p>
                //         {pair.token0Symbol}/{pair.token1Symbol}
                //     </p>
                // </div>
            ))}
        </div>
    );
}
