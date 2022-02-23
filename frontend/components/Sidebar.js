import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

const chains = ['ethereum', 'avalanche', 'fantom', 'harmony', 'binance-smart-chain'];

const Sidebar = ({ currentPage }) => {
    return (
        <div className="channel-bar shadow-lg h-screen">
            <ChannelBlock />
            <div className="channel-container">
                <Dropdown
                    header="new pairs"
                    section="pairs"
                    selections={['live-feed', 'statistics']}
                    startExpanded={currentPage == 'pairs' && true}
                />
                <Dropdown
                    header="new trades"
                    section="trades"
                    selections={['live-feed', 'statistics']}
                    startExpanded={currentPage == 'trades' && true}
                />
                <Dropdown
                    header="analyze addresses"
                    section="analyze"
                    selections={chains}
                    startExpanded={currentPage == 'analyze' && true}
                />
            </div>
        </div>
    );
};

const Dropdown = ({ header, section, selections, startExpanded }) => {
    const [expanded, setExpanded] = useState(startExpanded);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const Selections = () => {
        if (expanded && selections) {
            return selections.map((selection) => (
                <TopicSelection key={selection[0]} section={section} selection={selection} />
            ));
        }
        return null;
    };

    const headerClass = `hover:text-gray-600 dark:hover:text-gray-400 hover:cursor-pointer ${
        expanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'
    }`;

    return (
        <div className="dropdown">
            <button type="button" onClick={handleExpand} className="dropdown-header">
                <ChevronIcon expanded={expanded} />
                <Link href={`/${section}`}>
                    <a className={headerClass}>{header}</a>
                </Link>
            </button>
            <div>
                <Selections />
            </div>
        </div>
    );
};

const ChevronIcon = ({ expanded }) => {
    const chevClass = 'text-accent text-opacity-80 my-auto mr-1';
    return expanded ? (
        <FaChevronDown size="14" className={chevClass} />
    ) : (
        <FaChevronRight size="14" className={chevClass} />
    );
};

const TopicSelection = ({ section, selection }) => {
    const router = useRouter();

    const selectionClass = `hover:text-gray-600 dark:hover:text-gray-400 hover:cursor-pointer ${
        router.pathname === `/pairs/${selection}` ? 'dropdown-selection-text-selected' : 'dropdown-selection-text'
    }`;

    return (
        <div className="dropdown-selection">
            <div className="dropdown-selection-text">
                <Link href={`/${section}/${selection}`}>
                    <a className={selectionClass}>{selection}</a>
                </Link>
            </div>
        </div>
    );
};

const ChannelBlock = () => (
    <div className="channel-block">
        <h5 className="channel-block-text hover:cursor-default">placeholder</h5>
    </div>
);

export default Sidebar;
