import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

export default function LoadingPage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                loading...
            </div>
        </div>
    );
}
