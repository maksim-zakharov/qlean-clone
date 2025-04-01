module.exports = {
    apps: [{
        name: "app",
        script: "dist/main.js",
        env: {
            DATABASE_URL: process.env.DATABASE_URL,
            SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
            PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
            PM2_SECRET_KEY: process.env.PM2_SECRET_KEY
        }
    }]
}