import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../Security/Context/AuthContext";

function Header() {

  const [newShow, setShow] = useState(false)
 
  const [showConfirmation, setShowConfirmation] = useState(null)

  const showConfirmationToggle = () => {
    setShowConfirmation( prev => !prev )  
  }

  const apiUrl = import.meta.env.VITE_API_URL;


  const {logout} = useAuth()
  const navigate = useNavigate()
  const menuPointer = useRef(null)
  const openMenuPointer = useRef(null)

  const showMenu = () => {
    setShow((prev) => !prev)
  }

  const clickOutside = (event) => {
    if (menuPointer.current && !menuPointer.current.contains(event.target) &&
     openMenuPointer.current && !openMenuPointer.current.contains(event.target))
     {
      setShow(false)
     }
  }

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside)

    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
  }, [] )

  const handleLogout = () => {
    try { 
      logout()
      navigate("/login")
    }catch(err){
      console.error(err)
    }
    
  }

  return (
    <>
      <header className="header-container">
        <div className="accountContainer">
          <div className="account-button" onClick={showMenu} ref={openMenuPointer}>
            <label className="account-label"> VetHelp</label>
          </div>
          {newShow && ( 
            <div className= "dropdown-menu" ref={menuPointer}>
              <p className="menu-item" onClick={() => {navigate("/userProfile")}}> Perfil </p>
              <p className="menu-item" onClick={showConfirmationToggle}> Sair</p>
            </div>
          )}
        </div>
      </header>
      { showConfirmation &&  
        <div className="overlay">
          <div className="confirmationContainer">
          <h2>
              Você quer sair da sua conta? 
          </h2>
          <div className="botoesConfirmation">
              <button className = "confirmation" 
              onClick={() => {
                showConfirmationToggle()
                handleLogout()
                }}>
                  Confirmar
              </button>
              <button className= "cancelar" onClick={() => showConfirmationToggle()}>
                  Cancelar
              </button>
          </div>
          </div>
        </div>
      }
    </>
  );
}

export default Header;