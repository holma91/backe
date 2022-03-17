import React from 'react';

// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/Table';
import getAddresses from '../../dummydata/getAddresses';

const stats = {
    id: 18,
    address: '0x01f0831120ab81f91109e099afb551a091c4c05a',
    startValueUsd: '238956.18711267613',
    startValueEth: '71.01336629817602',
    endValueUsd: '768921.0171309289',
    endValueEth: '196.55452483096178',
    profitUsd: '529964.8300182528',
    profitEth: '125.54115853278576',
    againstUsd: '3.2178326346007355',
    againstEth: '2.767852519561663',
    txCount: '112',
    year: '2021',
};

const AnalyzeTable = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Account',
                accessor: 'label',
                Cell: AvatarCell,
                imgAccessor: 'imgUrl',
                addressAccessor: 'address',
            },
            {
                Header: 'Profit (USD)',
                accessor: 'profitUsd',
            },
            {
                Header: 'Profit (ETH)',
                accessor: 'profitEth',
            },
            {
                Header: 'Transactions',
                accessor: 'txCount',
            },
            {
                Header: 'Activity',
                accessor: 'activity',
                Cell: StatusPill,
            },
            {
                Header: 'Against USD',
                accessor: 'againstUsd',
            },
            {
                Header: 'Against ETH',
                accessor: 'againstEth',
            },
            {
                Header: 'Chain',
                accessor: 'chain',
                Filter: SelectColumnFilter,
                filter: 'includes',
            },
            {
                Header: 'Year',
                accessor: 'year',
                Filter: SelectColumnFilter,
                filter: 'includes',
            },
        ],
        []
    );

    const data = React.useMemo(() => getAddresses(), []);

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={data} />
        </div>
    );
};

export default AnalyzeTable;
