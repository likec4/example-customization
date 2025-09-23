import { oliveDark, oliveDarkA } from '@radix-ui/colors'
import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'cloud-system',
  title: 'Cloud System',
  styles: {
    theme: {
      colors: {
        // Override default colors 
        primary: '#256828',
        // Or specify exact colors
        muted: {
          elements: {
            fill: oliveDark.olive9,
            stroke: oliveDark.olive7,
            hiContrast: oliveDarkA.oliveA12,
            loContrast: oliveDarkA.oliveA11
          },
          relationships: {
            line: oliveDark.olive10,
            label: oliveDarkA.oliveA12,
            labelBg: oliveDark.olive2
          }
        }
      }
    },
    defaults: {
      color: 'primary',  
      opacity: 10,
      relationship: {
        color: 'muted',
        line: 'dotted',
        arrow: 'open'
      }
    }
  }
})
