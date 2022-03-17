import React from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table';
import { AvatarCell, GlobalFilter, PageSelector, ChangePage } from '../../components/Table';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';
import useFetch from '../../hooks/useFetch';
import information from '../../../backend/information';
import { SortIcon, SortUpIcon, SortDownIcon } from '../../components/shared/Icons';
import Table, { SelectColumnFilter } from '../../components/Table';

const PairTableContainer = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'pair',
                accessor: 'pair',
                Cell: AvatarCell,
                addressAccessor: 'pairAddress',
            },
            {
                Header: 'liquidity',
                accessor: 'liquidityUsd',
            },
            {
                Header: 'dex',
                accessor: 'dex',
                Filter: SelectColumnFilter,
                filter: 'includes',
                startValueFilter: 'all dexes',
            },
            {
                Header: 'chain',
                accessor: 'chain',
                Filter: SelectColumnFilter,
                filter: 'includes',
                startValueFilter: 'all chains',
            },
            {
                Header: 'token0',
                accessor: 'token0Name',
            },
            {
                Header: 'token1',
                accessor: 'token1Name',
            },
            {
                Header: 'created at (utc)',
                accessor: 'createdAt',
                id: 'createdAt',
            },
            {
                Header: 'block explorer',
                accessor: 'blockExplorerUrl',
                isLink: true,
            },
            {
                Header: 'chart',
                accessor: 'dexscreenerUrl',
                isLink: true,
            },
        ],
        []
    );

    const { data, isLoading, isError } = useFetch('pairs/');
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;

    let pairs = data.map((pair) => {
        return {
            ...pair,
            pair: `${pair.token0Symbol}/${pair.token1Symbol}`,
            liquidityUsd: pair.liquidityUsd,
            blockExplorerUrl: `${information[pair.chain]['urls']['explorer']}/address/${pair.pairAddress}`,
            dexscreenerUrl: `${information[pair.chain]['urls']['chart']}/${pair.pairAddress}`,
            createdAt: pair.createdAt ? pair.createdAt.slice(0, pair.createdAt.length - 5) : 'not recently',
        };
    });

    const initialState = {
        sortBy: [
            {
                id: 'createdAt',
                desc: true,
            },
        ],
        pageSize: 10,
    };

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={pairs} initialState={initialState} />
        </div>
    );
};

export default PairTableContainer;
