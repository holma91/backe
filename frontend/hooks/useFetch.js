import useSWR from 'swr';
// import 'dotenv/config';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useFetch(path) {
    const { data, error } = useSWR(`${process.env.api_url}${path}`, fetcher);
    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
}
