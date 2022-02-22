import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';
import Pair from '../../components/Pair';
import PairTable from './PairTable';

export default function Pairs() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                <div className="content-container">
                    <div className="grid grid-cols-4 gap-4 m-5">
                        <PairTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
