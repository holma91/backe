import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

export default function Layout({ children }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                {children}
            </div>
        </div>
    );
}
