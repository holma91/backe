import Sidebar from '../../components/Sidebar';
import AnalyzeTable from './AnalyzeTable';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    return (
        <div className="flex">
            <Sidebar currentPage={'analyze'} />
            <div className="content-container">
                <TopNavigation />
                <div className="content-container">
                    <div className="grid grid-cols-4 gap-4 m-5">
                        <AnalyzeTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
