import * as webpack from 'webpack';

export default {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Build-time environment variables
                COMMIT_HASH: JSON.stringify(process.env.COMMIT_HASH),
            }
        })
    ]
} as webpack.Configuration;
