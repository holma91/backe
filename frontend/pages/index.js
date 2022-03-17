import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex">
            <TextSection />
        </div>
    );
}

const TextSection = () => {
    return (
        <section className="text-card-container">
            <h1 className="text-2xl text-black mb-1 mt-1">About this website</h1>
            <WebsiteCard />
            <h1 className="text-2xl text-black mb-1 mt-1">About this project</h1>
            <ProjectCard />
        </section>
    );
};

const WebsiteCard = () => {
    return (
        <div className="">
            <div className="m-2">
                <Link href="/pairs">
                    <a className="font-bold hover:text-blue-400">/pairs</a>
                </Link>
                <p>a feed of new liquidity pairs that gets added on uniswap v2 and all of it's forks</p>
            </div>

            <div className="m-2">
                <Link href="/trades">
                    <a className="font-bold hover:text-blue-400">/trades</a>
                </Link>
                <p>a feed of new trades being made by the addresses we have chosen to follow</p>
            </div>
            <div className="m-2">
                <Link href="/analyze">
                    <a className="font-bold hover:text-blue-400">/analyze</a>
                </Link>
                <p>performance information about some addresses, for example how much up was address 0x123 in 2021?</p>
            </div>
        </div>
    );
};
const ProjectCard = () => {
    return (
        <div className="">
            <p>
                Check out the github for more information:{' '}
                <a
                    href="https://github.com/holma91/backe"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-400"
                >
                    github.com/holma91/backe
                </a>
            </p>
            <p className="m-1">
                <span className="font-bold">1. Analysis: </span>
                <span>Finding addresses and analyzing them</span>
            </p>
            <p className="m-1">
                <span className="font-bold">2. Bots: </span>
                <span>Follow what's happening on the blockchains in real-time</span>
            </p>
            <p className="m-1">
                <span className="font-bold">3. Backend: </span>
                <span>A web server and an API that exposes a set of endpoints to the frontend and the bots</span>
            </p>
            <p className="m-1">
                <span className="font-bold">4. Frontend: </span>
                <span>Acts as a kind of dashboard for everything else</span>
            </p>

            <p className="font-bold m-1">Architecture Overview</p>
            <Image src={'/arch.jpg'} layout="responsive" width={3000} height={2000} />
        </div>
    );
};
