import React from 'react';

// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import useFetch from '../../hooks/useFetch';
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/Table';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';
import getAddresses from '../../dummydata/getAddresses';

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

export default AnalyzeTable;
