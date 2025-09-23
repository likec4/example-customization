import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { LikeC4VitePlugin } from 'likec4/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    LikeC4VitePlugin({
      workspace: './likec4'
    }),
    react()
  ]
})
