import React from "react";
import { Link } from "react-router-dom";
import { EmprestimosContext } from "../components/Layout";

import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

import { v4 as uuidv4 } from "uuid";

import { PiKeyReturnFill } from "react-icons/pi";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export default function Adicionar() {
    const { emprestimos, setEmprestimos } = React.useContext(EmprestimosContext);

    const [items, setItems] = React.useState([{ itemsNome: "Cadeira de rodas", itemsQtd: 1, isActive: false }]);
    const [contacts, setContacts] = React.useState([{ nomeContato: "", telContato: "" }]);
    const [currentUser, setCurrentUser] = React.useState("Paulinha");
    const [selectedUser, setSelectedUser] = React.useState(false)
    const [formData, setFormData] = React.useState({
        id: uuidv4(),
        data: new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        usuario: currentUser,
        responsavel: "",
        cpfResponsavel: "",
        endereco: {
            cidade: "",
            bairro: "",
            rua: "",
            numeroRua: "",
        },
        itemsEmprestados: [...items],
        contatos: [...contacts],
        observacao: "",
        devolvido: false,
    });
    const [submitAttempt, setSubmitAttempt] = React.useState(false)
    const [showErrorModal, setShowErrorModal] = React.useState(false)
    const [showConfirmDataModal, setShowConfirmDataModal] = React.useState(false)
    const [showSuccessModal, setShowSuccessModal] = React.useState(false)

    const optionsRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const modalSelectRef = React.useRef(null);
    const formRef = React.useRef(null);

    const responsavelRef = React.useRef(null)
    const cpfResponsavelRef = React.useRef(null)
    const cidadeRef = React.useRef(null)
    const bairroRef = React.useRef(null)
    const ruaRef = React.useRef(null)
    const numeroRuaRef = React.useRef(null)
    const observacaoRef = React.useRef(null)

    React.useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });
    React.useEffect(() => {
        function updateUser() {
            setFormData((prevFormData) => {
                const newData = { ...prevFormData };
                newData.usuario = currentUser;
                return newData;
            });
        }
        updateUser();
    }, [currentUser]);
    React.useEffect(() => {
        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData.itemsEmprestados = items;
            return newData;
        });
    }, [items])

    function handleChange(event) {
        const { name, value } = event.target;
        const NESTED_END = ["cidade", "bairro", "rua", "numeroRua"];
        switch (true) {
            case NESTED_END.includes(name):
                setFormData((prevFormData) => {
                    const newData = { ...prevFormData };
                    newData.endereco[name] = value;
                    return newData;
                });
                break;
            default:
                setFormData((prevFormData) => {
                    return { ...prevFormData, [name]: value };
                });
                break;
        }
    }
    function handleItemSelectData(item, index) {
        let newData = items;
        newData[index].itemsNome = item;
        setItems(newData)

        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData.itemsEmprestados = items;
            return newData;
        });
    }
    function handleItemQtdData(event, index) {
        const { value } = event.target;
        let newData = items;
        newData[index].itemsQtd = value;
        setItems(newData)

        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData.itemsEmprestados = items;
            return newData;
        });
    }
    function handleContatoName(event, index) {
        const { value } = event.target;
        let newData = contacts;
        newData[index].nomeContato = value;
        setContacts(newData)

        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData.contatos = contacts;
            return newData;
        });
    }
    function handleContatoNumber(event, index) {
        const { value } = event.target;
        let newData = contacts;
        newData[index].telContato = value;
        setContacts(newData)

        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData.contatos = contacts;
            return newData;
        });
    }
    function handleUserSelected(usuario) {
        setCurrentUser(usuario)
        setSelectedUser(false)
    }

    function addItemInput() {
        setItems((prevData) => [
            ...prevData,
            { itemsNome: "Cadeira de rodas", itemsQtd: 1, isActive: false },
        ]);
    };
    function removeItemInput(event, index) {
        if (items.length > 1) {
            event.preventDefault();
            const linhas = [...items];
            linhas.splice(index, 1);
            setItems(linhas);
        }
    };
    function addContactInput() {
        setContacts((prevData) => [
            ...prevData,
            { nomeContato: "", telContato: "" }
        ]);
    };
    function removeContactInput(event, index) {
        if (contacts.length > 1) {
            event.preventDefault();
            const linhas = [...contacts];
            linhas.splice(index, 1);
            setContacts(linhas);
        }
    };

    const itemsNameElements = items.map((item, index) => (
        <div key={index} className="select" onClick={() => { handleItemSelectStatus(index) }} >
            <button type="button" className="select-btn" ref={optionsRef}>
                <span>{items[index].itemsNome}</span><span> {items[index].isActive ? <FaCaretUp /> : <FaCaretDown />}</span>
            </button>
            {items[index].isActive && <div className="select-options"  >
                <ul>
                    <li onClick={() => handleItemSelectData('Adaptador de vaso sanitário', index)}>Adaptador de vaso sanitário</li>
                    <li onClick={() => handleItemSelectData('Andador fixo', index)}>Andador fixo</li>
                    <li onClick={() => handleItemSelectData('Andador flexível', index)}>Andador flexível</li>
                    <li onClick={() => handleItemSelectData('Bota ortopédica', index)}>Bota ortopédica</li>
                    <li onClick={() => handleItemSelectData('Cadeira de banho', index)}>Cadeira de banho</li>
                    <li onClick={() => handleItemSelectData('Cadeira de rodas', index)}>Cadeira de rodas</li>
                    <li onClick={() => handleItemSelectData('Cama Hospitalar', index)}>Cama Hospitalar</li>
                    <li onClick={() => handleItemSelectData('Colchão casca de ovo', index)}>Colchão casca de ovo</li>
                    <li onClick={() => handleItemSelectData('Colchão de ar', index)}>Colchão de ar</li>
                    <li onClick={() => handleItemSelectData('Colchão Hospitalar', index)}>Colchão Hospitalar</li>
                    <li onClick={() => handleItemSelectData('Colete cervical', index)}>Colete cervical</li>
                    <li onClick={() => handleItemSelectData('Comadre', index)}>Comadre</li>
                    <li onClick={() => handleItemSelectData('Faixa de compressão', index)}>Faixa de compressão</li>
                    <li onClick={() => handleItemSelectData('Joelheira', index)}>Joelheira</li>
                    <li onClick={() => handleItemSelectData('Muleta', index)}>Muleta</li>
                    <li onClick={() => handleItemSelectData('Muleta Canadense', index)}>Muleta Canadense</li>
                    <li onClick={() => handleItemSelectData('Munhequeira', index)}>Munhequeira</li>
                    <li onClick={() => handleItemSelectData('Papagaio', index)}>Papagaio</li>
                    <li onClick={() => handleItemSelectData('Suporte para soro', index)}>Suporte para soro</li>
                    <li onClick={() => handleItemSelectData('Tipóia', index)}>Tipóia</li>
                    <li onClick={() => handleItemSelectData('Tornozeleira', index)}>Tornozeleira</li>
                
                </ul>
            </div>}
        </div>

    ))
    const itemsQtdElements = items.map((item, index) => (
        <div key={index} className="qtdAndRemove">
            <input
                name="itemsQtd"
                autoComplete="off"
                type="number"
                min="1"
                placeholder="1"
                value={items[index].itemsQtd}
                onChange={() => handleItemQtdData(event, index)}
                required />
            <IoIosCloseCircle onClick={() => removeItemInput(event, index)} />
        </div>
    ))
    const contatosNameElements = contacts.map((item, index) => (
        <div key={index} className="contato-name">
            <input
                name="nomeContato"
                autoComplete="off"
                placeholder="Nome do contato"
                value={contacts[index].nomeContato}
                className={submitAttempt && contacts[index].nomeContato === '' ? 'highlight' : ''}
                onChange={() => handleContatoName(event, index)}
                onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                required />
        </div>
    ))
    const contatosNumberElements = contacts.map((item, index) => (
        <div key={index} className="contato-number">
            <input
                name="numeroContato"
                autoComplete="off"
                type="tel"
                placeholder="Número de telefone"
                value={contacts[index].telContato}
                className={submitAttempt && contacts[index].telContato === '' ? 'highlight' : ''}
                onChange={() => handleContatoNumber(event, index)}
                onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                required />
            <IoIosCloseCircle onClick={() => removeContactInput(event, index)} />
        </div>
    ))

    function handleItemSelectStatus(index) {
        let newData = items;

        let isOtherActive = items.map((item, idx) => {
            return idx == index ? 'IGNORE' : items[idx].isActive
        })

        if (!isOtherActive.includes(true)) {

            newData[index].isActive = !newData[index].isActive;
            setItems(newData)

            setFormData((prevFormData) => {
                const newData = { ...prevFormData };
                newData.itemsEmprestados = items;
                return newData;
            });
        }


    }
    function handleOutsideClick(event) {

        const modifiedData = items.map(item => {
            return { ...item, isActive: false }
        })

        if (optionsRef.current && !optionsRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
            setItems(modifiedData)
        }

        if (modalSelectRef.current && !modalSelectRef.current.contains(event.target)) {
            setSelectedUser(false)
        }
    };
    function itemsToText() {
        let texto = ''
        for (let item of items) {
            if (item == items[items.length - 1]) {
                texto += `${item.itemsNome} (${item.itemsQtd}).`
            } else {
                texto += `${item.itemsNome} (${item.itemsQtd}), `
            }
        }
        return texto
    }
    function contactsToText() {
        let texto = ''
        for (let contact of contacts) {
            if (contact == contacts[contacts.length - 1]) {
                texto += `${contact.nomeContato} - (${contact.telContato}).`
            } else {
                texto += `${contact.nomeContato} - (${contact.telContato}), `
            }
        }
        return texto
    }
    function confirmData(){
        async function addEmprestimoToFile() {
            const newArray = [...emprestimos];
            newArray.push(formData);
            setEmprestimos(newArray);
            await writeTextFile(
                {
                    path: "IGDS-DATA/emprestimos-data.json",
                    contents: JSON.stringify(newArray),
                },
                { dir: BaseDirectory.AppData }
            );
        }

        setShowSuccessModal(true);
        setSubmitAttempt(false);

        addEmprestimoToFile()

        const emptyItems = [{ itemsNome: "Cadeira de rodas", itemsQtd: 1, isActive: false }];
        setItems(emptyItems)
        const emptyContacts = [{ nomeContato: "", telContato: "" }];
        setContacts(emptyContacts)

        const emptyFormData = {
            id: uuidv4(),
            data: new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
            usuario: currentUser,
            responsavel: "",
            cpfResponsavel: "",
            endereco: {
                cidade: "",
                bairro: "",
                rua: "",
                numeroRua: "",
            },
            itemsEmprestados: [...emptyItems],
            contatos: [...emptyContacts],
            observacao: "",
            devolvido: false,
        }

        setFormData(emptyFormData)
    }
    function validateForm(event) {
        event.preventDefault();
        setSubmitAttempt(true);

        const allRefs = [responsavelRef, cpfResponsavelRef, cidadeRef, bairroRef, ruaRef, numeroRuaRef, observacaoRef]

        const emptyFields = []
        for (let item of allRefs) {
            if (item.current.value === '') {
                item.current.className = 'highlight'
                emptyFields.push(item)
            }
        }
        for (let contact of contacts) {
            if (contact.nomeContato === '' || contact.telContato === '') {
                emptyFields.push(contact)
            }
        }

        if (emptyFields.length) {
            setShowErrorModal(true)
        } else {
            setShowConfirmDataModal(true)
        }

    }

    return (
        <div className="adicionar-section">
            <header>
                <h3>NOVO EMPRÉSTIMO</h3>
                <Link to=".." relative="path">
                    <span>INÍCIO</span>
                    <PiKeyReturnFill />
                </Link>
            </header>

            <form autoComplete="off" ref={formRef}>
                <div className="row">
                    <label htmlFor="responsavelInput">
                        Nome do responsável
                        <input
                            ref={responsavelRef}
                            name="responsavel"
                            autoComplete="off"
                            type="text"
                            id="responsavelInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.responsavel}
                            placeholder="Nome do responsável"
                            required
                        />
                    </label>

                    <label htmlFor="rgcpfInput">
                        RG/CPF
                        <input
                            ref={cpfResponsavelRef}
                            name="cpfResponsavel"
                            autoComplete="off"
                            type="number"
                            id="rgcpfInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.cpfResponsavel}
                            placeholder="Insira o RG ou CPF"
                            required
                        />
                    </label>
                </div>

                <div className="row">
                    <label htmlFor="cidadeInput">
                        Cidade
                        <input
                            ref={cidadeRef}
                            name="cidade"
                            autoComplete="off"
                            type="text"
                            id="cidadeInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.endereco.cidade}
                            placeholder="Cidade"
                            required
                        />
                    </label>

                    <label htmlFor="bairroInput">
                        Bairro
                        <input
                            ref={bairroRef}
                            name="bairro"
                            autoComplete="off"
                            type="text"
                            id="bairroInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.endereco.bairro}
                            placeholder="Bairro"
                            required
                        />
                    </label>
                </div>

                <div className="row">
                    <label htmlFor="ruaInput">
                        Rua
                        <input
                            ref={ruaRef}
                            name="rua"
                            autoComplete="off"
                            type="text"
                            id="ruaInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.endereco.rua}
                            placeholder="Nome da rua"
                            required
                        />
                    </label>

                    <label htmlFor="numeroEnderecoInput">
                        Nº
                        <input
                            ref={numeroRuaRef}
                            name="numeroRua"
                            autoComplete="off"
                            type="number"
                            min="0"
                            id="numeroEnderecoInput"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            value={formData.endereco.numeroRua}
                            placeholder="Número"
                            required
                        />
                    </label>
                </div>

                <div className="items-row">
                    <div className="item-pair" ref={dropdownRef}>
                        <label>
                            Items Emprestados
                        </label>
                        {itemsNameElements}
                    </div>

                    <div className="item-pair">
                        <label>
                            QTD
                        </label>
                        {itemsQtdElements}
                    </div>

                </div>

                <span className="add-item-btn" onClick={() => addItemInput()} >
                    <IoIosAddCircle />
                    Adicionar item
                </span>

                <div className="contatos-row">
                    <div className="item-pair">
                        <label>Nome do contato</label>
                        {contatosNameElements}
                    </div>

                    <div className="item-pair">
                        <label>Número de telefone</label>
                        {contatosNumberElements}
                    </div>

                </div>

                <span className="add-contact-btn" onClick={() => addContactInput()} >
                    <IoIosAddCircle />
                    Adicionar contato
                </span>

                <div className="row textarea-row">
                    <label htmlFor="observacoes">
                        Observação
                        <textarea
                            ref={observacaoRef}
                            name="observacao"
                            onChange={handleChange}
                            onFocus={(event) => event.currentTarget.classList.remove('highlight')}
                            id="observacoes"
                            autoComplete="off"
                            value={formData.observacao}
                            placeholder="Observações..."
                            resize='none'
                        ></textarea>
                    </label>
                </div>

                <button className="confirmar-btn" onClick={() => validateForm(event)}>CONFIRMAR</button>
            </form>

            {showErrorModal && <div className="error-modal" onClick={() => setShowErrorModal(false)}>
                <button> Preencha os campos vazios.</button>
            </div>}

            {showSuccessModal && <div className="success-modal" onClick={() => setShowSuccessModal(false)}>
                <button> Empréstimo realizado!</button>
            </div>}

            {showConfirmDataModal && <div className="confirm-data-modal">
                <div className="container">
                   
                    <div className="data">
                        <span className="sub-title">Dados do responsável:</span>
                        <span>Nome: {formData.responsavel}</span>
                        <span>CPG/RG: {formData.cpfResponsavel}</span>
                        <span>Cidade: {formData.endereco.cidade}</span>
                        <span>Bairro: {formData.endereco.bairro}</span>
                        <span>Rua: {formData.endereco.rua}, Nº{formData.endereco.numeroRua}</span>
                        <span className="sub-title">Items emprestados:</span>
                        <span>{itemsToText()}</span>
                        <span className="sub-title">Contatos:</span>
                        <span>{contactsToText()}</span>
                        <span className="sub-title">Observação:</span>
                        <span>{formData.observacao}</span>

                        <div className="data-user-select" ref={modalSelectRef}>
                        <button className="usuario-select-btn" onClick={() => setSelectedUser(prev => !prev)}>
                            Usuário: {currentUser} {selectedUser ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                        {selectedUser && <div className="select-options">
                            <ul>
                                <li onClick={() => { handleUserSelected('Paulinha') }}>Paulinha</li>
                                <li onClick={() => { handleUserSelected('Paulo') }}>Paulo</li>
                                <li onClick={() => { handleUserSelected('Simone') }}>Simone</li>
                                <li onClick={() => { handleUserSelected('Rose') }}>Rose</li>
                            </ul>
                        </div>}
                    </div>
                    </div>

                    <div className="btns">
                        <button onClick={() => {
                            setShowConfirmDataModal(false)
                            confirmData()
                        }}> Confirmar dados.</button>
                        <button onClick={() => setShowConfirmDataModal(false)}> Alterar dados.</button>
                    </div>
                </div>
            </div>}
        </div>

    );
}
