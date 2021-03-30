module.exports = {
    prefix: 'tw-',
    purge: {
        enabled: process.env.NODE_ENV === 'prod',
        content: [
            './src/**/*.{html,ts}',
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
