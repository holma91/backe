import React from 'react';

// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import getAddresses from '../../dummydata/getAddresses';
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/Table';

const AnalyzeTable = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Pair',
                accessor: 'pair',
                addressAccessor: 'pairAddress',
            },
            {
                Header: 'Liquidity (USD)',
                accessor: 'liquidity-in-usd',
            },
            {
                Header: 'DEX',
                accessor: 'dex',
            },
            {
                Header: 'Token0',
                accessor: 'token0',
            },
            {
                Header: 'Token1',
                accessor: 'token1',
            },
            {
                Header: 'Block Explorer Pair',
                accessor: 'block-explorer-pair',
            },
            {
                Header: 'Block Explorer New Token',
                accessor: 'block-explorer-new-token',
            },
            {
                Header: 'Dexscreener',
                accessor: 'dexscreener',
            },
        ],
        []
    );

    const data = React.useMemo(() => getPairs(), []);

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={data} />
        </div>
    );
};

export default AnalyzeTable;
