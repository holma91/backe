import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

export default function ErrorPage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                error!
            </div>
        </div>
    );
}
