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
        <div className="flex">
            <div>
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
        </div>
    );
}
