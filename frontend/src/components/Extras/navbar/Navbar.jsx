import './Navbar.css'
import { useNavigate, useLocation } from 'react-router-dom';
import ArrayOptions from "./arrayOptions/arrayOptions";
import Header from "../Header/header";

const Navbar = (User) => {

    const navigate = useNavigate()

    const options = ArrayOptions(User) || []

    return (
        <div className='navigationBar'>
            <div className='navigationBarOptions'>
                {
                    options.map((option) => (
                        <div key={option.nome}
                            className="navigationBar-link"
                            onClick={() => navigate(option.url)}
                        >
                            <label className='link-label' >{option.nome || "nome não encontrado"}</label>
                        </div>
                    )
                    )}
            </div>
            <div id="header">
                <Header />
            </div>
        </div>
    )
}

export default Navbar