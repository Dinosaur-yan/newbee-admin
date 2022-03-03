import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.vue', '.js', '.jsx', '.json', '.ts']
  },
  base: './',
  server: {
    port: 4001,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace('/api/', '/')
      }
    }
  }
})
