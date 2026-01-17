import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './components/Security/Context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

axios.defaults.withCredentials = true 

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
)
