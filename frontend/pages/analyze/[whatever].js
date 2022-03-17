import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { whatever } = router.query;

    return <div>{whatever}</div>;
}
