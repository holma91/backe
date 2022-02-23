import { FaSearch, FaHashtag, FaRegBell, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useDarkMode from '../hooks/useDarkMode';

const TopNavigation = () => (
    <div className="top-navigation">
        <Title />
        <ThemeIcon />
        <Search />
        <BellIcon />
        <UserCircle />
    </div>
);

const ThemeIcon = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);

    return (
        <button type="button" onClick={handleMode}>
            {darkTheme ? (
                <FaSun size="24" className="top-navigation-icon" />
            ) : (
                <FaMoon size="24" className="top-navigation-icon" />
            )}
        </button>
    );
};

const Search = () => (
    <div className="search">
        <input className="search-input border-none focus:ring-transparent" type="text" placeholder="Search..." />
        <FaSearch size="18" className="text-secondary my-auto" />
    </div>
);
const BellIcon = () => <FaRegBell size="24" className="top-navigation-icon" />;
const UserCircle = () => <FaUserCircle size="24" className="top-navigation-icon" />;
const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = () => {
    const router = useRouter();
    console.log(router);
    return <h5 className="title-text pl-2">{router.asPath}</h5>;
};

export default TopNavigation;
