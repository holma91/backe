import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
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

    return (
        <div className="flex">
            <div>
                {pairs.map((pair) => (
                    <div className="message-container">
                        <pre>{JSON.stringify(pair, undefined, 2)}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}
