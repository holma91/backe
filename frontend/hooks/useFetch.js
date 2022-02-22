import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useFetch(path) {
    const { data, error } = useSWR(`http://localhost:3005/${path}`, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
}
