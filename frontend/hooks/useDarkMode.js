import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            let item = undefined;
            if (typeof window !== undefined) {
                item = window.localStorage.getItem(key);
            }
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            if (typeof window !== undefined) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

const useDarkMode = () => {
    // const [enabled, setEnabled] = useLocalStorage('dark-theme');
    // local storage is fucked with nextjs because of server side rendering (works with create-react-app)
    // so we default to dark mode here
    const [enabled, setEnabled] = useState(true);
    const isEnabled = typeof enabledState === 'undefined' && enabled;

    useEffect(() => {
        const className = 'dark';
        const bodyClass = window.document.body.classList;

        isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
    }, [enabled, isEnabled]);

    return [enabled, setEnabled];
};

export default useDarkMode;
