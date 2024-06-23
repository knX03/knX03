/*
const {defineConfig} = require('@vue/cli-service')

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:80',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/'),

                onProxyReq(proxyReq, req, res) {
                    console.log('>>>请求', req);
                },
                onProxyRes(proxyRes, req, res) {
                    // 响应的钩子函数
                    console.log('>>>响应', res);
                },
            }
        }
    },
})*/
