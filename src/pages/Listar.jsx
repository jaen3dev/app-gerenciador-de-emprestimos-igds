import React from "react";
import { Link } from "react-router-dom";
import { EmprestimosContext } from "../components/Layout"

import { PiKeyReturnFill } from "react-icons/pi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export default function Listar() {

    const { emprestimos } = React.useContext(EmprestimosContext)
    const [filteredData, setFilteredData] = React.useState([])
    const [showItemsSort, setShowItemsSort] = React.useState(false)

    const [dateSorted, setDateSorted] = React.useState(false)
    const [dateFilter, setDateFilter] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState('TODOS')
    const [userFilter, setUserFilter] = React.useState('TODOS')

    const [selectedUserActive, setSelectedUserActive] = React.useState(false)
    const [selectedStatusActive, setSelectedStatusActive] = React.useState(false)

    const usuarioSelectRef = React.useRef(null);
    const statusSelectRef = React.useRef(null);

    function handleOutsideClick(event) {
        if (usuarioSelectRef.current && !usuarioSelectRef.current.contains(event.target)) {
            setSelectedUserActive(false)
        }

        if (statusSelectRef.current && !statusSelectRef.current.contains(event.target)) {
            setSelectedStatusActive(false)
        }
    };


    React.useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    React.useEffect(() => {
        setFilteredData(emprestimos);
    }, [])

    React.useEffect(() => {
        handleFilter()
    }, [dateFilter, statusFilter, userFilter, dateSorted])


    function handleChange(event) {
        const { value } = event.target
        setDateFilter(value)
    }

    function handleFilter() {
        function formatDateHyphenToSlash(date) {
            return `${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}`
        }

        function formatDateSlashToHyphen(date) {
            return `${date.split('/')[2]}-${date.split('/')[1]}-${date.split('/')[0]}`
        }

        function formatStatus(status) {
            return status == 'DEVOLVIDO' ? true : false
        }


        setFilteredData(emprestimos.filter((item) => dateFilter != '' ? item.data == formatDateHyphenToSlash(dateFilter) : item)
            .filter((item) => statusFilter != 'TODOS' ? item.devolvido == formatStatus(statusFilter) : item)
            .filter((item) => userFilter != 'TODOS' ? item.usuario == userFilter : item)
            .sort((a, b) => !dateSorted ?
                new Date(formatDateSlashToHyphen(b.data)) - new Date(formatDateSlashToHyphen(a.data)) :
                new Date(formatDateSlashToHyphen(a.data)) - new Date(formatDateSlashToHyphen(b.data)))
        )
    }

    const emprestimosElements = filteredData.map(item => (
        <Link to={item.id} key={item.id} >
            <span className="resp"> {item.responsavel} </span>
            <span className="items"> {item.itemsEmprestados.map((x) => `${x.itemsNome} (${x.itemsQtd})`).join(', ')} </span>
            <span className="user">{item.usuario}</span>
            <span className="data">{item.data}</span>
            <span className={item.devolvido ? 'status devolvido' : 'status pendente'}>{item.devolvido ? 'DEVOLVIDO' : 'PENDENTE'}</span>
        </Link>
    ))

    return (
        <div className="listar-section">
            <header>
                <h3>LISTAR EMPRÉSTIMOS</h3>
                <Link to=".." relative="path">
                    <span>INÍCIO</span>
                    <PiKeyReturnFill />
                </Link>
            </header>
            <div className="emprestimos">
                <div className="filtros">
                    <div className="filtro-row">
                        <div className="filtro-data">
                            <label htmlFor="filtro-data">DATA
                                <input type="date" id="start" name="filtro-data" onChange={handleChange} value={dateFilter} />
                            </label>
                        </div>
                        <div className="filtro-usuario" ref={usuarioSelectRef} >
                            <span>USUÁRIO</span>
                            <button className="usuario-select-btn" onClick={() => setSelectedUserActive(prev => !prev)}>
                                {userFilter} {selectedUserActive ? <FaCaretUp /> : <FaCaretDown />}
                            </button>
                            {selectedUserActive && <div className="select-options">
                                <ul>
                                    <li onClick={() => {
                                        setUserFilter('TODOS')
                                        setSelectedUserActive(false)
                                    }}>TODOS</li>
                                    <li onClick={() => {
                                        setUserFilter('Paulinha')
                                        setSelectedUserActive(false)
                                    }}>Paulinha</li>
                                    <li onClick={() => {
                                        setUserFilter('Paulo')
                                        setSelectedUserActive(false)
                                    }}>Paulo</li>
                                    <li onClick={() => {
                                        setUserFilter('Simone')
                                        setSelectedUserActive(false)
                                    }}>Simone</li>
                                    <li onClick={() => {
                                        setUserFilter('Rose')
                                        setSelectedUserActive(false)
                                    }}>Rose</li>
                                </ul>
                            </div>}
                        </div>
                        <div className="filtro-status" ref={statusSelectRef} >
                            <span>STATUS</span>
                            <button className="usuario-select-btn" onClick={() => setSelectedStatusActive(prev => !prev)}>
                                {statusFilter} {selectedStatusActive ? <FaCaretUp /> : <FaCaretDown />}
                            </button>
                            {selectedStatusActive && <div className="select-options">
                                <ul>
                                    <li onClick={() => {
                                        setStatusFilter('TODOS')
                                        setSelectedStatusActive(false)
                                    }}>TODOS</li>
                                    <li onClick={() => {
                                        setStatusFilter('DEVOLVIDO')
                                        setSelectedStatusActive(false)
                                    }}>DEVOLVIDO</li>
                                    <li onClick={() => {
                                        setStatusFilter('PENDENTE')
                                        setSelectedStatusActive(false)
                                    }}>PENDENTE</li>
                                </ul>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="container-lista">
                    <div className="titulos-lista">
                        <span className="resp">Responsável</span>
                        <span className="items">Items</span>
                        <span className="user">Usuário</span>
                        <span className="data" onClick={() => setDateSorted(prev => !prev)}>Data {dateSorted ? <FaCaretUp /> : <FaCaretDown />} </span>
                        <span className="status">Status</span>
                    </div>
                    <div className="dados-lista">
                        {emprestimosElements}
                    </div>
                </div>
            </div>
        </div>
    )
}