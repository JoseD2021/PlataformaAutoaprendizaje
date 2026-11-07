import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import './shared/styles/tokens.css'
import './shared/styles/global.css'
import { App } from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)