import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@tenant/index.css'
import App from '@tenant/App.jsx'
import { TenantProvider } from '@core/context/TenantContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenantProvider>
      <App />
    </TenantProvider>
  </StrictMode>,
)
