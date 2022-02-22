import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    const router = useRouter();
    const { chain } = router.query;

    return (
        <div className="flex">
            <Sidebar />
            <div className="content-container">
                <TopNavigation />
                {chain}
            </div>
        </div>
    );
}
Sidebar;
