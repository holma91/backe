import React from 'react';
// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import { StatusPillOrder } from '../../components/Table';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';
import useFetch from '../../hooks/useFetch';
import Table, { SelectColumnFilter } from '../../components/Table';

const TradeTableContainer = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'from',
                accessor: 'senderAddress',
            },
            {
                Header: 'token',
                accessor: 'tokenSymbol',
            },
            {
                Header: 'order',
                accessor: 'tradeOrder',
                Filter: SelectColumnFilter,
                filter: 'includes',
                startValueFilter: 'all orders',
                Cell: StatusPillOrder,
            },
            {
                Header: 'amount',
                accessor: 'amount',
            },
            {
                Header: 'price',
                accessor: 'tokenPrice',
            },
            {
                Header: 'total',
                accessor: 'total',
            },
            {
                Header: 'on coingecko',
                accessor: 'onCoingecko',
            },
            {
                Header: 'chain',
                accessor: 'chain',
            },
            {
                Header: 'timestamp (utc)',
                accessor: 'tradeTimestamp',
            },
        ],
        []
    );

    const { data, isLoading, isError } = useFetch('trades/');
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;

    const trades = data.map((trade) => ({
        ...trade,
        total: trade.tokenPrice * trade.amount,
        onCoingecko: trade.onCoingecko ? 'true' : 'false',
    }));

    const initialState = {
        sortBy: [
            {
                id: 'createdAt',
                desc: true,
            },
        ],
        pageSize: 15,
    };

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={trades} initialState={initialState} />
        </div>
    );
};

export default TradeTableContainer;
