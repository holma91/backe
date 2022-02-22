export default function Pair({ pair }) {
    console.log(pair);
    return (
        <div className="pair-card">
            <div className="always-visible">
                <p>
                    {pair.token0Symbol}/{pair.token1Symbol}
                </p>
                <p>${pair.liquidityUsd}</p>
                <p>{pair.pairAddress}</p>
            </div>
        </div>
    );
}
