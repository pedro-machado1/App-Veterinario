import "./Navbar.css";    
import {useNavigate, useLocation} from 'react-router-dom';
import ArrayOptions from "./arrayOptions/arrayOptions"; 
import Header from "../header/header";

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    return ( 
        <div>
            {
                ArrayOptions().map((option) => (
                    <div key={option.nome} 
                    className= "optionDisplay"
                    onClick={() => navigate(option.url)}
                    >
                        <label htmlFor="DescriptionLabel">{option.nome || "nome não encontrado"}</label>
                    </div>
                )
            )}
            <Header/>

        </div>
    )
}

export default Navbar