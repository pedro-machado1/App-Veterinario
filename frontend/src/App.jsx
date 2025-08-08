import { useState } from 'react'
import './App.css'
import './assets/css/buttoms.css'
import "./assets/css/text.css"
import NewAnimal from './components/Cadastros/Animal/NewAnimal.jsx'
import NewCliente from './components/Cadastros/Cliente/NewCliente.jsx'
import NewConsulta from './components/Cadastros/Consulta/newConsulta.jsx'
import NewConsultorio from './components/Cadastros/Consultorio/newConsultorio/newConsultorio.jsx'
import NewMedicamento from './components/Cadastros/Medicamento/newMedicamento.jsx'
import NewMedicamentoItem from './components/Cadastros/MedicamentoItem/NewMedicamentoItem.jsx'
import NewVacina from './components/Cadastros/Vacina/newVacina.jsx'
import NewVacinaItem from './components/Cadastros/VacinaItem/newVacinaitem.jsx'
import NewVeterinario from './components/Cadastros/Veterinario/addVeterinario/newVeterinario.jsx'
import RegisterComponent from './components/Security/Register/RegisterComponent.jsx'
import LoginComponents from './components/Security/Login/LoginComponents.jsx'
import ResetPassword from './components/Security/ResetPassword/ResetPassword.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter> 
      <Routes>
        <Route path = '/reset-password' element= {<ResetPassword/>} />
        <Route path="/login" element={<LoginComponents />} />
        <Route path="/newConsulta" element={<NewConsulta />} />
        <Route path="/newAnimal" element={<NewAnimal />} />
        <Route path="/newCliente" element={<NewCliente />} />
        <Route path ="/register" element = {<RegisterComponent/>}/> 
        <Route path="/newConsultorio" element={<NewConsultorio />} />
        <Route path="/newMedicamento" element={<NewMedicamento />} />
        <Route path="/newMedicamentoItem" element={<NewMedicamentoItem />} />
        <Route path="/newVacina" element={<NewVacina />} />
        <Route path="/newVacinaItem" element={<NewVacinaItem />} />
        <Route path="/newVeterinario" element={<NewVeterinario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
