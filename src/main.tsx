import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CustomOverlayProvider } from './CustomOverlay.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomOverlayProvider>
      <App />
    </CustomOverlayProvider>
  </StrictMode>,
)
