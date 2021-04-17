const {guessProductionMode} = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
    prefix: 'tw-',
    mode: 'jit',
    purge: {
        content: [
            './src/**/*.{html,ts,css,scss,sass,less,styl}',
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
};
