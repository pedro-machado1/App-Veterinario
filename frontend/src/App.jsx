import './App.css'
import './assets/css/buttoms.css'
import "./assets/css/text.css"
import MainPage from './pages/MainPage/mainPage.jsx'
import NewCliente from './components/Cadastros/Cliente/NewCliente/NewCliente.jsx'
import NewConsulta from './components/Cadastros/Consulta/newConsulta.jsx'
import NewConsultorio from './components/Cadastros/Consultorio/newConsultorio/newConsultorio.jsx'
import NewMedicamento from './components/Cadastros/Medicamento/newMedicamento.jsx'
import NewMedicamentoItem from './components/Cadastros/MedicamentoItem/NewMedicamentoItem.jsx'
import NewVacina from './components/Cadastros/Vacina/newVacina.jsx'
import NewVacinaItem from './components/Cadastros/VacinaItem/newVacinaitem.jsx'
import NewVeterinario from './components/Cadastros/Veterinario/addVeterinario/newVeterinario.jsx'
import RegisterComponent from './components/Security/Register/RegisterComponent.jsx'
import LoginComponents from './components/Security/Login/LoginComponents.jsx'
import Navbar from './components/Extras/navbar/Navbar.jsx'
import ForgotPasswordComponents from './components/Security/ForgotPassword/ForgotPasswordComponents.jsx'
import ResetPassword from './components/Security/ResetPassword/ResetPassword.jsx'
import ProtectedRoute from './components/Security/Context/ProtectRoute.jsx'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import UserProfile from './pages/UserProfile/UserProfile.jsx'
import EditAnimal from './components/Cadastros/Animal/MainAnimal/MainAnimal.jsx'
import MainConsultorio from './components/Cadastros/Consultorio/MainConsultorio/MainConsultorio.jsx' 
import RegisterConsultorio from './components/Cadastros/Consultorio/RegisterConsultorio/RegisterConsultorio.jsx'

function App() {
  
  return (
    <BrowserRouter> 
      <Routes>
        <Route path = "/forgot-password" element = {<ForgotPasswordComponents/>} />
        <Route path = "/reset-password" element= {<ResetPassword/>} />
        <Route path="/login" element={<LoginComponents />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/registerConsultorio" element={<RegisterConsultorio />} />
        <Route path="/newConsulta" element={<ProtectedRoute><NewConsulta /></ProtectedRoute>} />
        <Route path="/animal" element={<ProtectedRoute><EditAnimal /></ProtectedRoute>} />
        <Route path="/newCliente" element={<ProtectedRoute><NewCliente /></ProtectedRoute>} />
        <Route path="/navbar" element={<ProtectedRoute><Navbar /></ProtectedRoute>} />
        <Route path="/newConsultorio" element={<ProtectedRoute><NewConsultorio /></ProtectedRoute>} />
        <Route path="/consultorio" element={<ProtectedRoute><MainConsultorio /></ProtectedRoute>} />
        <Route path="/newMedicamento" element={<ProtectedRoute><NewMedicamento /></ProtectedRoute>} />
        <Route path="/newMedicamentoItem" element={<ProtectedRoute><NewMedicamentoItem /></ProtectedRoute>} />
        <Route path="/newVacina" element={<ProtectedRoute><NewVacina /></ProtectedRoute>} />
        <Route path="/newVacinaItem" element={<ProtectedRoute><NewVacinaItem /></ProtectedRoute>} />
        <Route path="/newVeterinario" element={<ProtectedRoute><NewVeterinario /></ProtectedRoute>} />
        <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path= "/home" element= {<ProtectedRoute><MainPage /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
