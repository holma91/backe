import React from 'react';
// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table';
import { AvatarCell, GlobalFilter, PageSelector, ChangePage, StatusPillOrder } from '../../components/Table';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';
import useFetch from '../../hooks/useFetch';
import information from '../../../backend/information';
import { SortIcon, SortUpIcon, SortDownIcon } from '../../components/shared/Icons';

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

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={trades} />
        </div>
    );
};

function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id, startValueFilter } }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
            <option value="">{startValueFilter}</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,

        state,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'createdAt',
                        desc: true,
                    },
                ],
            },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const Headers = () =>
        headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) =>
                column.Filter ? (
                    <div className="mt-2 sm:mt-0" key={column.id}>
                        {column.render('Filter')}
                    </div>
                ) : null
            )
        );

    return (
        <div>
            <div className="sm:flex sm:gap-x-2">
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <Headers />
            </div>
            {/* table */}
            <div className="mt-4 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <TableHeader headerGroups={headerGroups} />
                                </thead>
                                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                                    <TableBody page={page} prepareRow={prepareRow} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <div className="py-3 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <PageSelector state={state} setPageSize={setPageSize} pageOptions={pageOptions} />
                    <ChangePage
                        canPreviousPage={canPreviousPage}
                        canNextPage={canNextPage}
                        previousPage={previousPage}
                        nextPage={nextPage}
                        gotoPage={gotoPage}
                        pageCount={pageCount}
                    />
                </div>
            </div>
        </div>
    );
}

const TableHeader = ({ headerGroups }) =>
    headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                    scope="col"
                    className="group px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                    <div className="flex items-center justify-between">
                        {column.render('Header')}
                        {/* Add a sort direction indicator */}
                        <span>
                            {column.isSorted ? (
                                column.isSortedDesc ? (
                                    <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                            ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                            )}
                        </span>
                    </div>
                </th>
            ))}
        </tr>
    ));

const TableBody = ({ page, prepareRow }) => {
    const chevClass = 'text-accent text-opacity-80 my-auto mr-1';

    return page.map((row) => {
        prepareRow(row);
        return (
            <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-3 py-1 whitespace-nowrap" role="cell">
                        <div className="text-sm text-gray-500">
                            {cell.column.isLink ? (
                                <a href={`${cell.value}`} target="_blank">
                                    to {cell.column.Header}
                                </a>
                            ) : (
                                <>{cell.render('Cell')}</>
                            )}
                        </div>
                    </td>
                ))}
            </tr>
        );
    });
};

export default TradeTableContainer;
