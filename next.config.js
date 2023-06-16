const withSvgr = require("@newhighsco/next-plugin-svgr")

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["avatars.githubusercontent.com"],
    },
    experimental: {
        appDir: true,
    },
    rewrites: () => [
        {
            source: "/pm/lib.min.js",
            destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js",
        },
        {
            source: "/pm/lib.js",
            destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.js",
        },
        {
            source: "/pm/decide",
            destination: "https://decide.mixpanel.com/decide",
        },
        {
            source: "/pm/:slug",
            destination: "https://api.mixpanel.com/:slug",
        },
    ],
}

module.exports = withSvgr({
    ...nextConfig,
    svgrOptions: {
        typescript: true,
        dimensions: false,
        svgo: false,
    },
})
