import { FaSearch, FaHashtag, FaRegBell, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import useDarkMode from '../hooks/useDarkMode';

function TopNavigation() {
    return (
        <div className="top-navigation">
            <HashtagIcon />
            <Title />
            <ThemeIcon />
            <Search />
            <BellIcon />
            <UserCircle />
        </div>
    );
}

function ThemeIcon() {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
        <span onClick={handleMode}>
            {darkTheme ? (
                <FaSun size="24" className="top-navigation-icon" />
            ) : (
                <FaMoon size="24" className="top-navigation-icon" />
            )}
        </span>
    );
}

function Search() {
  return <div className="search">
        <input className="search-input border-none focus:ring-transparent" type="text" placeholder="Search..." />
        <FaSearch size="18" className="text-secondary my-auto" />
    </div>
}
function BellIcon() {
  return <FaRegBell size="24" className="top-navigation-icon" />
}
function UserCircle() {
  return <FaUserCircle size="24" className="top-navigation-icon" />
}
function HashtagIcon() {
  return <FaHashtag size="20" className="title-hashtag" />
}
function Title() {
  return <h5 className="title-text">tailwind-css</h5>
}

export default TopNavigation;
