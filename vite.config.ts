// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx', 'ts', 'jsx', 'js'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/geocoding': {
        target: 'https://geocoding.open-meteo.com/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/geocoding/, ''),
      },
      '/api/weather': {
        target: 'https://api.open-meteo.com/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/weather/, ''),
      },
    },
  },
});
