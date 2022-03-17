import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
    const menuItems = [
        {
            href: '/analyze',
            title: 'analyze',
            accessor: 'analyze',
            inner: [
                { outerHref: '/analyze', href: '', title: 'all chains', accessor: '' },
                { outerHref: '/analyze', href: '/coming-soon', title: 'coming soon', accessor: 'coming-soon' },
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
            href: '/pairs',
            title: 'pairs',
            accessor: 'pairs',
            inner: [
                { outerHref: '/pairs', href: '', title: 'all pairs', accessor: 'all-pairs' },
                { outerHref: '/pairs', href: '/live-feed', title: 'live feed', accessor: 'live-feed' },
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
    const expanded = firstPartUrl === menuItem.accessor;

    const headerClass = `flex hover:text-gray-600 dark:hover:text-gray-400 hover:cursor-pointer ${
        expanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'
    }`;

    return (
        <div className="dropdown">
            <button type="button" className="dropdown-header">
                <Link href={menuItem.href}>
                    <a className={headerClass}>
                        <ChevronIcon expanded={expanded} />
                        {menuItem.title}
                    </a>
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
        selected ? 'dropdown-inner-selection-text-selected' : 'dropdown-inner-selection-text'
    }`;

    return (
        <div className="dropdown-selection">
            <div className="dropdown-inner-selection-text">
                <button type="button" className="dropdown-header">
                    <Link href={innerMenuItem.outerHref + innerMenuItem.href}>
                        <a className={selectionClass}>{innerMenuItem.title}</a>
                    </Link>
                </button>
            </div>
        </div>
    );
};

const ChevronIcon = ({ expanded }) => {
    const chevClass = 'text-accent text-opacity-80 my-auto mr-2';
    return expanded ? (
        <FaChevronDown size="14" className={chevClass + ' text-gray-600 dark:text-gray-400'} />
    ) : (
        <FaChevronRight size="14" className={chevClass} />
    );
};

const HeaderBlock = () => (
    <div className="channel-block">
        <Link href="/">
            <a className="channel-block-text hover:cursor-pointer">hassebacke</a>
        </Link>
    </div>
);

export default Sidebar;
