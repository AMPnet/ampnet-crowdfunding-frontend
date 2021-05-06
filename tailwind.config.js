const {guessProductionMode} = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

const registerColor = (colorVarText) => ({opacityVariable, opacityValue}) => {
    if (opacityValue !== undefined) {
        return `rgba(${colorVarText}, ${opacityValue})`
    }
    if (opacityVariable !== undefined) {
        return `rgba(${colorVarText}, var(${opacityVariable}, 1))`
    }
    return `rgb(${colorVarText})`
}

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
        extend: {
            colors: {
                primary: registerColor('var(--color-primary)'),
                secondary: registerColor('var(--color-secondary)')
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
};
