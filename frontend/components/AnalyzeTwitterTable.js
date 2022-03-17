import React from 'react';
import useFetch from '../hooks/useFetch';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
// WARNING: IF THE LINE BELOW IS REMOVED IT WONT COMPILE,
// because of "ReferenceError: regeneratorRuntime is not defined"
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import Table, { AvatarCell, SelectColumnFilter, StatusPillProfit } from './Table';

const AnalyzeTwitterTableTokens = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'token',
                accessor: 'ticker',
            },
            {
                Header: 'mentions',
                accessor: 'count',
            },
        ],
        []
    );

    const { data, isLoading, isError } = useFetch('twitter/tokens/');
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;
    const initialState = {
        pageSize: 10,
    };

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={data} initialState={initialState} />
        </div>
    );
};

const AnalyzeTwitterTableMentions = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'account',
                accessor: 'username',
                Cell: AvatarCell,
                addressAccessor: 'twitterId',
            },
            {
                Header: 'ticker',
                accessor: 'ticker',
            },
            {
                Header: 'tweet',
                accessor: 'tweetUrl',
                isLink: true,
            },
            {
                Header: 'timestamp',
                accessor: 'tweetTimestamp',
            },
        ],
        []
    );

    const { data, isLoading, isError } = useFetch('twitter/ticker-mentions/');
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;
    const initialState = {
        pageSize: 10,
    };

    let mentions = data.map((mention) => {
        return {
            ...mention,
            tweetUrl: `https://twitter.com/${mention.username}/status/${mention.tweetId}`,
        };
    });

    return (
        <div className="col-span-4 m-5">
            <Table columns={columns} data={mentions} initialState={initialState} />
        </div>
    );
};

export { AnalyzeTwitterTableTokens, AnalyzeTwitterTableMentions };
