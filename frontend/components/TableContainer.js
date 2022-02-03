<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> parent of 547d03b... Autolint
import regeneratorRuntime from 'regenerator-runtime'; // because of "ReferenceError: regeneratorRuntime is not defined"
import getAddresses from '../dummydata/getAddresses';
import React from 'react';
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from './Table';

const TableContainer = () => {
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
                accessor: 'profit-in-usd',
            },
            {
                Header: 'Profit (ETH)',
                accessor: 'profit-in-eth',
            },
            {
                Header: 'Account Value (USD)',
                accessor: 'account-value',
            },
            {
                Header: 'Activity',
                accessor: 'activity',
                Cell: StatusPill,
            },
            {
                Header: 'Age',
                accessor: 'age',
            },
            {
                Header: 'Connections',
                accessor: 'connections',
            },
            {
                Header: 'Top Holding',
                accessor: 'top-erc20-holding',
            },
            {
                Header: 'Chains',
                accessor: 'chains',
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

export default TableContainer;
