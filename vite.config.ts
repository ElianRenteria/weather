import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/weather/',
  server: {
    port: 5500,
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'], // Automatically imports Vue Composition API functions
      dts: 'src/auto-imports.d.ts', // Generates a TypeScript declaration file
    }),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })
  ],
})
