import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    return (
        <div className="flex">
            <Sidebar currentPage={'trades'} />
            <div className="content-container">
                <TopNavigation />
            </div>
        </div>
    );
}
