import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const menuItems = [
        {
            href: '/pairs',
            title: 'pairs',
            accessor: 'pairs',
            inner: [
                { outerHref: '/pairs', href: '', title: 'all pairs', accessor: 'all-pairs' },
                { outerHref: '/pairs', href: '/live-feed', title: 'live feed', accessor: 'live-feed' },
            ],
        },
        {
            href: '/trades',
            title: 'trades',
            accessor: 'trades',
            inner: [
                { outerHref: '/trades', href: '', title: 'all trades', accessor: '' },
                { outerHref: '/trades', href: '/live-feed', title: 'live feed', accessor: 'live-feed' },
            ],
        },
        {
            href: '/analyze',
            title: 'analyze addresses',
            accessor: 'analyze',
            inner: [
                { outerHref: '/analyze', href: '', title: 'all chains', accessor: '' },
                { outerHref: '/analyze', href: '/ethereum', title: 'ethereum', accessor: 'ethereum' },
                { outerHref: '/analyze', href: '/bsc', title: 'binance smart chain', accessor: 'bsc' },
                { outerHref: '/analyze', href: '/fantom', title: 'fantom', accessor: 'fantom' },
            ],
        },
    ];

    return (
        <div className="channel-bar shadow-lg h-screen">
            <HeaderBlock />
            <div className="channel-container">
                {menuItems.map((menuItem) => (
                    <Dropdown menuItem={menuItem} />
                ))}
            </div>
        </div>
    );
};

const Dropdown = ({ menuItem }) => {
    const router = useRouter();
    const firstPartUrl = router.asPath.split('/')[1];
    console.log('fpu:', firstPartUrl);
    const expanded = firstPartUrl === menuItem.accessor;

    const headerClass = `hover:text-gray-600 dark:hover:text-gray-400 hover:cursor-pointer ${
        expanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'
    }`;

    return (
        <div className="dropdown">
            <button type="button" className="dropdown-header">
                <Link href={menuItem.href}>
                    <a className={headerClass}>{menuItem.title}</a>
                </Link>
            </button>
            <div>
                {expanded
                    ? menuItem.inner.map((innerMenuItem) => (
                          <InnerSelection key={innerMenuItem.href} innerMenuItem={innerMenuItem} />
                      ))
                    : null}
            </div>
        </div>
    );
};

const InnerSelection = ({ innerMenuItem }) => {
    const router = useRouter();
    let selected = router.asPath === innerMenuItem.outerHref + innerMenuItem.href;
    const selectionClass = `hover:text-gray-600 dark:hover:text-gray-400 hover:cursor-pointer ${
        selected ? 'dropdown-selection-text-selected' : 'dropdown-selection-text'
    }`;

    return (
        <div className="dropdown-selection">
            <div className="dropdown-selection-text">
                <button type="button" className="dropdown-header">
                    <Link href={innerMenuItem.outerHref + innerMenuItem.href}>
                        <a className={selectionClass}>{innerMenuItem.title}</a>
                    </Link>
                </button>
            </div>
        </div>
    );
};

const HeaderBlock = () => (
    <div className="channel-block">
        <h5 className="channel-block-text hover:cursor-default">placeholder</h5>
    </div>
);

export default Sidebar;
