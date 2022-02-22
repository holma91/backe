import { useState } from 'react';
import { BsHash } from 'react-icons/bs';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const chains = ['ethereum', 'avalanche', 'fantom', 'harmony', 'binance smart chain'];

const ChannelBar = () => (
    <div className="channel-bar shadow-lg h-screen">
        <ChannelBlock />
        <div className="channel-container">
            <Dropdown header="new pairs" selections={chains} />
            <Dropdown header="new trades" selections={chains} />
            <Dropdown header="analyze addresses" selections={chains} />
        </div>
    </div>
);

const Dropdown = ({ header, selections }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const Selections = () => {
        if (expanded && selections) {
            return selections.map((selection) => <TopicSelection key={selection[0]} selection={selection} />);
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
                <h5 className={headerClass}>{header}</h5>
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

const TopicSelection = ({ selection }) => (
    <div className="dropdown-selection">
        <BsHash size="24" className="text-gray-400" />
        <div className="dropdown-selection-text">
            <h5 className=" hover:text-gray-600 dark:hover:text-gray-400">{selection}</h5>
        </div>
    </div>
);

const ChannelBlock = () => (
    <div className="channel-block">
        <h5 className="channel-block-text hover:cursor-default">placeholder</h5>
    </div>
);

export default ChannelBar;
