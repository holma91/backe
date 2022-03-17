import { FaSearch, FaHashtag, FaRegBell, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useDarkMode from '../hooks/useDarkMode';

const TopNavigation = () => (
    <div className="top-navigation">
        <Title />
        <ThemeIcon />
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

const Title = () => {
    const router = useRouter();
    console.log(router);
    return <h5 className="title-text pl-2">{router.asPath}</h5>;
};

export default TopNavigation;
