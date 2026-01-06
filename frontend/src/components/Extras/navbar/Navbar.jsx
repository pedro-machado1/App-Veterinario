import './Navbar.css'
import {useNavigate, useLocation} from 'react-router-dom';
import ArrayOptions from "./arrayOptions/arrayOptions"; 
import Header from "../Header/header";
import { useEffect } from 'react';

const Navbar = (User) => {

    const navigate = useNavigate()

    const location = useLocation()
    
    // useEffect (() => { 
    //     if (location.pathname == "/login" || location.pathname == "/reset-password" || location.pathname == "/forgot-password" || location.pathname == "/regiter" ) {
    //         clean()
    //     }
    // }, [location.pathname])
    
    // const clean = () => {
    //     return (<></>)
    // }
    return ( 
        <div className='navbar'>
            <div className='navbarOptions'>
                { 
                    ArrayOptions(User).map((option) => (
                        <div key={option.nome}
                        className= "navbar-link"
                        onClick={() => navigate(option.url)}
                        >
                            <label className='link-label' >{option.nome || "nome não encontrado"}</label>
                        </div>
                    )
                )}
            </div>
            <div id = "header">
                <Header/>
            </div>
        </div>
    )
}

export default Navbar