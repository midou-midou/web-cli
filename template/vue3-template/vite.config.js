import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      // valid file extensions for components.
      extensions: ['vue'],
      resolvers: [AntDesignVueResolver({
        importStyle: false,
      })],
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',

      /**
       * 自定义插入位置
       * @default: body-last
       */
      inject: 'body-last',

      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      customDomId: '__svg__icons__dom__',
    })
  ],
  server: {
    // open: true,
    proxy: {
      '/koatest': {
        target: 'http://localhost:8081/httpstest',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/koatest/, '')
      },
      '/dev': {
        // ssl: {

        // },
        target: 'https://www.virustotal.com',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, '')
      }
    },
  },
})
