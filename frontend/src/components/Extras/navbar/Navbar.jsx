import './Navbar.css'
import {useNavigate, useLocation} from 'react-router-dom';
import ArrayOptions from "./arrayOptions/arrayOptions"; 
import Header from "../Header/header";

const Navbar = (User) => {

    const navigate = useNavigate()
    
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