import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';
import useFetch from '../../hooks/useFetch';
import Pair from '../../components/Pair';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';

export default function Pairs() {
    // get all pairs
    const { data, isLoading, isError } = useFetch('pairs/');
    console.log(isError);
    if (isError) return <ErrorPage />;
    if (isLoading) return <LoadingPage />;

    // render data
    console.log(data);

    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                {data.map((pair) => (
                    <Pair pair={pair} />
                ))}
            </div>
        </div>
    );
}
