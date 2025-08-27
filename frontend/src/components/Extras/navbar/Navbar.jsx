import './Navbar.css'
import {useNavigate, useLocation} from 'react-router-dom';
import ArrayOptions from "./arrayOptions/arrayOptions"; 
import Header from "../Header/header";

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    return ( 
        <div className='navbar'>
            {
                ArrayOptions().map((option) => (
                    <div key={option.nome}
                    className= "navbar-link"
                    onClick={() => navigate(option.url)}
                    >
                        <label className='link-label' htmlFor="DescriptionLabel">{option.nome || "nome não encontrado"}</label>
                    </div>
                )
            )}
            <Header/>

        </div>
    )
}

export default Navbar