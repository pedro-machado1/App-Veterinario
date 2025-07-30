import { useState } from 'react'
import './App.css'
import './assets/css/buttoms.css'
import "./assets/css/text.css"
import NewClient from './components/Cliente/NewCliente.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NewClient />
    </>
  )
}

export default App
