import { useRouter } from 'next/router';
import Channelbar from '../../components/ChannelBar';
import TopNavigation from '../../components/TopNavigation';

export default function Home() {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div className="flex">
      <Channelbar />
      <div className="content-container">
        <TopNavigation />
        {address}
      </div>
    </div>
  );
}
