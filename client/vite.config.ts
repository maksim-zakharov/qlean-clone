import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import svgr from '@svgr/rollup'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
        ],
        force: true
    },
    plugins: [
        svgr(),
        tailwindcss(),
        react()
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // ваш бэкенд-сервер
                secure: false, // игнорировать ошибки сертификата
                changeOrigin: true,
                // Настройка прокси через Charles
                // agent:  new proxy.HttpProxyAgent('http://localhost:8888') // порт Charles
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                // Добавляем хеш к именам файлов
                entryFileNames: `assets/[name].[hash].js`,
                chunkFileNames: `assets/[name].[hash].js`,
                assetFileNames: `assets/[name].[hash].[ext]`
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
