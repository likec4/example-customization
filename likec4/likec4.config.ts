import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'cloud-system',
  title: 'Cloud System',
  styles: {
    theme: {
      colors: {
        primary: '#256828ff',
        muted: '#484e4cff'
      }
    },
    defaults: {
      color: 'sky',
      opacity: 10,
      relationship: {
        color: 'muted',
        line: 'dotted',
        arrow: 'open'
      }
    }
  }
})
