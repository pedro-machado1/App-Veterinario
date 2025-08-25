import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../Security/Context/AuthContext";

function Header() {

  const [newShow, setShow] = useState(false)

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
      <header className="header">
        <div className="accountContainer">
          <div className="account" onClick={showMenu} ref={openMenuPointer}>
            <label htmlFor=""> VetHelp</label>
          </div>
          {newShow && ( 
            <div ref={menuPointer}>
              <p onClick={() => {navigate("/userProfile")}}> Perfil </p>
              <p onClick={handleLogout}> Sair</p>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;