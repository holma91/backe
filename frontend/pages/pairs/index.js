import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';
import useFetch from '../../hooks/useFetch';
import Pair from '../../components/Pair';

export default function Pairs() {
    // get all pairs
    const { data, isLoading, isError } = useFetch('pairs/');
    console.log(isError);
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

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
