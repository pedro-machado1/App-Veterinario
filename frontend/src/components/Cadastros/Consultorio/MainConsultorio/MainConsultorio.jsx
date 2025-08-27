import "./MainConsultorio.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Security/Context/AuthContext";
import { useEffect, useState, useRef } from "react";

const MainConsultorio = () => {

    const navigate = useNavigate();

    return(
        <div>
            <h1>Consultorio</h1>
        <button className="botaoCadastrarConsultorio" onClick={() => { navigate("/registerConsultorio")}}>
            Cadastrar Consultório
        </button>
        </div>
    )
}

export default MainConsultorio;