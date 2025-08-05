import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  vite: {
    define: {
      SEND_MESSAGE: process.env.NODE_ENV === 'production'
    }
  }
});