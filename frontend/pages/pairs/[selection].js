import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
    const router = useRouter();
    const { selection } = router.query;

    return (
        <div className="flex">
            <Sidebar currentPage={'pairs'} />
            <div className="content-container">
                <TopNavigation />
                {selection}
            </div>
        </div>
    );
}
