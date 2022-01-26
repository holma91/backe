module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // class, 'media' or boolean
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
};
