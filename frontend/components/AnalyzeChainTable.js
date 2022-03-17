import React from 'react';
import useFetch from '../hooks/useFetch';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';

// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import Table, { AvatarCell, SelectColumnFilter, StatusPillProfit } from './Table';

const AnalyzeTable = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Account',
                accessor: 'address',
            },
            {
                Header: 'Profit (USD)',
                accessor: 'profitUsd',
                Cell: StatusPillProfit,
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

    //const data = React.useMemo(() => getAddresses(), []);
    const { data, isLoading, isError } = useFetch('accounts/stats/');
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;

    const accounts = data.map((account) => ({
        ...account,
        // https://stackoverflow.com/questions/2283566/how-can-i-round-a-number-in-javascript-tofixed-returns-a-string
        profitUsd: Math.round(account.profitUsd * 1) / 1,
        profitEth: Math.round(account.profitEth * 1e2) / 1e2,
        againstUsd: Math.round(account.againstUsd * 1e2) / 1e2,
        againstEth: Math.round(account.againstEth * 1e2) / 1e2,
    }));

    const initialState = {
        sortBy: [
            {
                id: 'profitUsd',
                desc: true,
            },
        ],
        pageSize: 15,
    };

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={accounts} initialState={initialState} />
        </div>
    );
};

export default AnalyzeTable;
