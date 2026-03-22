import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Inject data-component attributes on React components in dev mode
          './babel-plugin-component-attr.cjs',
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
})
