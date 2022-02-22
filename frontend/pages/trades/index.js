import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
            </div>
        </div>
    );
}
