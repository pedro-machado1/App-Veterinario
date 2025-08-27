import "./MainVeterinario.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Security/Context/AuthContext";
import { useEffect, useState, useRef } from "react";

const MainConsultorio = () => {

    const navigate = useNavigate();

    return(
        <div>
            <h1>Veterinário</h1>
        <button className="botaoCadastrarVeterinario" onClick={() => { navigate("/registerVeterinario")}}>
            Cadastrar Veterinário
        </button>
        </div>
    )
}

export default MainConsultorio;