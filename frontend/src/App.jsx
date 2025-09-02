import './App.css'
import './assets/css/buttoms.css'
import "./assets/css/text.css"
import MainPage from './pages/MainPage/mainPage.jsx'
import NewCliente from './components/Cadastros/Cliente/NewCliente/NewCliente.jsx'
import NewConsulta from './components/Cadastros/Consulta/newConsulta/newConsulta.jsx'
import NewConsultorio from './components/Cadastros/Consultorio/newConsultorio/newConsultorio.jsx'
import NewMedicamento from './components/Cadastros/Medicamento/newMedicamento.jsx'
import NewMedicamentoItem from './components/Cadastros/MedicamentoItem/NewMedicamentoItem.jsx'
import NewVacina from './components/Cadastros/Vacina/newVacina.jsx'
import NewVacinaItem from './components/Cadastros/VacinaItem/newVacinaItem.jsx'
import NewVeterinario from './components/Cadastros/Veterinario/newVeterinario/newVeterinario.jsx'
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
import RegisterVeterinario from './components/Cadastros/Veterinario/RegisterVeterinario/RegisterVeterinario.jsx'
import MainVeterinario from './components/Cadastros/Veterinario/MainVeterinario/MainVeterinario.jsx'
import { useAuth } from './components/Security/Context/AuthContext.jsx'
import SendEmailVeterinario from './components/Cadastros/Veterinario/RegisterVeterinario/SendEmailVeterinario.jsx'
import MainCliente from './components/Cadastros/Cliente/MainCliente/MainCliente.jsx'

function App() {

  const {isAuthenticated} = useAuth();
  

  return (
    <>
      <BrowserRouter> 
        {isAuthenticated == true && <Navbar/>}  
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
          <Route path="/veterinario" element={<ProtectedRoute><MainVeterinario /></ProtectedRoute>} />
          <Route path="/sendVeterinario" element={<ProtectedRoute><SendEmailVeterinario /></ProtectedRoute>} />
          <Route path="/registerVeterinario" element={<ProtectedRoute><RegisterVeterinario /></ProtectedRoute>} />
          <Route path="/consultorio" element={<ProtectedRoute><MainConsultorio /></ProtectedRoute>} />
          <Route path="/newMedicamento" element={<ProtectedRoute><NewMedicamento /></ProtectedRoute>} />
          <Route path="/newMedicamentoItem" element={<ProtectedRoute><NewMedicamentoItem /></ProtectedRoute>} />
          <Route path="/newVacina" element={<ProtectedRoute><NewVacina /></ProtectedRoute>} />
          <Route path="/newVacinaItem" element={<ProtectedRoute><NewVacinaItem /></ProtectedRoute>} />
          <Route path="/registerVeterinario" element={<ProtectedRoute><RegisterVeterinario /></ProtectedRoute>} />
          <Route path="/newVeterinario" element={<ProtectedRoute><NewVeterinario /></ProtectedRoute>} />
          <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/cliente" element={<ProtectedRoute><MainCliente /></ProtectedRoute>} />
          <Route path= "/home" element= {<ProtectedRoute><MainPage /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
