import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { MockDataProvider } from './contexts/MockDataContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/oto-note/">
      <AuthProvider>
        <MockDataProvider>
          <App />
        </MockDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
