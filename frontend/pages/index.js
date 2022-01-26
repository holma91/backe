import Channelbar from '../components/ChannelBar';
import ContentContainer from '../components/ContentContainer';
import TopNavigation from '../components/TopNavigation';

export default function Home() {
    return (
        <div className="flex">
            <Channelbar />
            <div className="content-container">
                <TopNavigation />
                <ContentContainer />
            </div>
        </div>
    );
}
