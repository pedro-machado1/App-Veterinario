import "./VeterinarioUpdate.css"
import { useState, useEffect } from 'react';
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import notLogin from "../../../../assets/images/notLogin.png"

const VeterinarioUpdate = ({
    id,
    name,
    cpf,
    crvm,
    estado,
    phone,
    dataDeNascimento,
    endereco,
    imagem,
    onClose,

}) => {

    const [newName, setName] = useState(name || "");
    const [newCpf, setCpf] = useState(cpf || "");
    const [newCRVM, setCRVM] = useState(crvm || "");
    const [newEstado, setEstado] = useState(estado || "");
    const [newPhone, setPhone] = useState(phone || "");
    const [newDataDeNascimento, setDataDeNascimento] = useState(dataDeNascimento || "");
    const [newEndereco, setEndereco] = useState(endereco || "");
    const [newImagem, setImagem] = useState("");
    const [previewImg, setPreviewImg] = useState(null);
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();


    useEffect(() => {
        const fetchInitialData = async () => {

            setIsLoading(true);
            const imageResponse = await axios.get(
                `${apiUrl}/api/veterinario/${id}/imagem`,
                { responseType: 'blob' }
            );
            if (imageResponse.data.size > 0) {
                let currentImageUrl = URL.createObjectURL(imageResponse.data);
                setPreviewImg(currentImageUrl);
            } else {
                setPreviewImg(null);
            }
        }

        fetchInitialData()
        setIsLoading(false)
    }, [id])

    const isInvalid = (e) => {
        e.target.classList.add("isInvalid");
    };

    const isValid = (e) => {
        if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
            console.log(e.target.className)
            e.target.classList.remove("isInvalid");
        }
    };

    const CheckPhone = (PHONE) => {
        const onlyDigits = PHONE.replace(/\D/g, '');
        if (onlyDigits.length === 10 || onlyDigits.length === 11) {
            setError(null);
            return true;
        }
        else {
            setError('Formato de Telefone Inválido!');
            return false;
        }
    }

    const CheckCpf = (CPF) => {
        const onlyDigits = CPF.replace(/\D/g, '');
        if (onlyDigits.length === 11) {
            setError(null);
            return true;
        } else {
            setError('Formato de Cpf Inválido!');
            return false;
        }
    }

    const CheckDate = (DATE) => {
        const today = new Date();
        const inputDate = new Date(DATE);
        if (inputDate > today) {
            setError('Data de Nascimento não pode ser futura!');
            return false;
        } else {
            setError(null);
            return true;
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (
            !CheckCpf(newCpf) ||
            !CheckPhone(newPhone) ||
            !CheckDate(newDataDeNascimento)
        ) return;

        const UpdateVeterinario = {
            nome: newName,
            crvm: newCRVM,
            cpf: parseInt(newCpf.replace(/\D/g, "")),
            estado: newEstado,
            telefone: parseInt(newPhone.replace(/\D/g, "")),
            dataDeNascimento: newDataDeNascimento,
            endereco: newEndereco
        };
        if (!document.getElementById("formsUpdateVeterinario").reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }
        setIsLoading(true);



        const formData = new FormData();

        const veterinarioBlob = new Blob([JSON.stringify(newClient)], { type: 'application/json' });
        formData.append("veterinario", veterinarioBlob);

        if (newImagem) {
            formData.append("imagem", newImagem);
        }

        try {
            const response = await axios.put(
                `${apiUrl}/api/veterinario`,
                UpdateVeterinario,
            );
            console.log('Updated Vetererinario:', response.data);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
            if (err.response && err.response.data) {
                setIsLoading(false);
                setError(`${err.response.data.message}`);
            }
        }
        onClose()
    };

    function maskCpf(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function maskPhone(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagem(null);
            setPreviewImg(null);
        }
    };

    return (
        <div className="veterinario-container ">
            <form
                id="formsUpdateVeterinario"
                onSubmit={handleUpdate}>

                <InputField
                    label="URL da Imagem"
                    placeholder={"Coloque a Imagem de perfil do cliente"}
                    idInput="newImagem"
                    classNameDiv="inputImagem"
                    type="file"
                    onChange={handleImageChange}
                />
                {previewImg ? (
                    <img
                        src={previewImg}
                        alt="Preview"
                        className="veterinario-image"
                    />
                ) : (
                    <img
                        src={notLogin}
                        alt="Sem imagem"
                        className="veterinario-image"
                    />
                )}
                <div className="line1">
                    <InputField
                        label="Nome"
                        placeholder={"Digite o nome do veterinario"}
                        name={"name"}
                        idInput="newName"
                        classNameDiv="inputName"
                        value={newName}
                        onChange={(e) => {
                            setName(e.target.value);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="CRVM"
                        placeholder="Informe o CRVM"
                        name="CRVM"
                        idInput="newCRVM"
                        classNameDiv="inputCRVM"
                        value={newCRVM}
                        onChange={(e) => {
                            setCRVM(e.target.value);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="CPF"
                        placeholder={"Digite o CPF do veterinario"}
                        name={"cpf"}
                        idInput="newCpf"
                        classNameDiv="inputCpf"
                        value={maskCpf(newCpf)}
                        onChange={(e) => {
                            const masked = maskCpf(e.target.value);
                            setCpf(masked);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                </div>
                <div className="line2">
                    <div className="inputEstado">
                        <label htmlFor="newEstado">Estado</label>
                        <select
                            id="newEstado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione...
                            </option>
                            <option value="Acre">Acre</option>
                            <option value="Amapá">Amapá</option>
                            <option value="Alagoas">Alagoas</option>
                            <option value="Amazonas">Amazonas</option>
                            <option value="Bahia">Bahia</option>
                            <option value="Ceará">Ceará</option>
                            <option value="Distrito Federal">Distrito Federal</option>
                            <option value="Espírito Santo">Espírito Santo</option>
                            <option value="Goiás">Goiás</option>
                            <option value="Maranhão">Maranhão</option>
                            <option value="Mato Grosso">Mato Grosso</option>
                            <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                            <option value="Minas Gerais">Minas Gerais</option>
                            <option value="Pará">Pará</option>
                            <option value="Paraíba">Paraíba</option>
                            <option value="Paraná">Paraná</option>
                            <option value="Pernambuco">Pernambuco</option>
                            <option value="Piauí">Piauí</option>
                            <option value="Rio de Janeiro">Rio de Janeiro</option>
                            <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                            <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                            <option value="Rondônia">Rondônia</option>
                            <option value="Roraima">Roraima</option>
                            <option value="Santa Catarina">Santa Catarina</option>
                            <option value="São Paulo">São Paulo</option>
                            <option value="Sergipe">Sergipe</option>
                            <option value="Tocantins">Tocantins</option>
                        </select>
                    </div>

                    <InputField
                        label="Telefone"
                        placeholder={"Digite o telefone do veterinario"}
                        name={"phone"}
                        idInput="newPhone"
                        classNameDiv="inputPhone"
                        value={maskPhone(newPhone)}
                        onChange={(e) => {
                            const masked = maskPhone(e.target.value);
                            setPhone(masked);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="Data de Nascimento"
                        placeholder={"Digite a data de nascimento do veterinario"}
                        name={"dataDeNascimento"}
                        idInput="newDataDeNascimento"
                        classNameDiv="inputdataDeNascimento"
                        type="date"
                        value={newDataDeNascimento}
                        onChange={(e) => {
                            setDataDeNascimento(e.target.value);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                </div>
                <div className="line3"></div>
                <InputField
                    label="Endereço"
                    placeholder={"Digite o endereço do veterinario"}
                    idInput="newendereco"
                    classNameDiv="inputendereco"
                    value={newEndereco}
                    onChange={(e) => {
                        setEndereco(e.target.value);
                        isValid(e);
                    }}
                    onInvalid={(e) => isInvalid(e)}
                    required
                />
                <div className="errorsOrSuccess">
                    <p style={{ color: "red" }}>{Error && Error}</p>
                    <p style={{ color: "green" }}>{Success && Success}</p>
                </div>
                <button
                    type="submit"
                    onClick={handleUpdate}
                    className="submit">
                    Atualizar
                </button>
            </form>
            <button
                type="buttom"
                className="fechar"
                onClick={onClose}>
                Fechar
            </button>

            {isLoading && <LoadingSpin />}
        </div>
    );
};

export default VeterinarioUpdate;