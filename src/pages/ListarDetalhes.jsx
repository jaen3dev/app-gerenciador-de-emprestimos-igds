import React from "react";
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";
import { EmprestimosContext } from "../components/Layout"
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import qrCode from '../assets/qrcode.jpeg'

import { PiKeyReturnFill } from "react-icons/pi";

export default function ListarDetalhes() {
    const params = useParams()
    const { emprestimos, setEmprestimos } = React.useContext(EmprestimosContext)

    const [emprestimo, setEmprestimo] = React.useState('null')
    const [contatos, setContatos] = React.useState([])
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)

    React.useEffect(() => {
        setEmprestimo(emprestimos.find(obj => obj.id === params.id))
    }, [params.id])

    React.useEffect(() => {
        setEmprestimo(emprestimos.find(obj => obj.id === params.id))
    }, [emprestimos])

    React.useEffect(() => {
        setContatos(emprestimo.contatos)
    }, [emprestimo])

    const contactsElements = contatos && contatos.map((contato, index) => (
        <span key={index} className="contato">
            - {contato.nomeContato} - {contato.telContato};
        </span>
    ))

    function returnItems() {
        let text = ''
        for (let item in emprestimo.itemsEmprestados) {
            if (Number(item) + 1 == emprestimo.itemsEmprestados.length) {
                text += `${emprestimo.itemsEmprestados[item].itemsNome} (${emprestimo.itemsEmprestados[item].itemsQtd}).`
            } else {
                text += `${emprestimo.itemsEmprestados[item].itemsNome} (${emprestimo.itemsEmprestados[item].itemsQtd}), `
            }
        }
        return text
    }
    function contactsToText() {
        let text = ''
        for (let item in emprestimo.contatos) {
            if (Number(item) + 1 == emprestimo.contatos.length) {
                text += `${emprestimo.contatos[item].nomeContato} (${emprestimo.contatos[item].telContato}).`
            } else {
                text += `${emprestimo.contatos[item].nomeContato} (${emprestimo.contatos[item].telContato}), `
            }
        }
        return text
    }
    function deleteEmprestimo() {

        const indexAlvo = emprestimos.findIndex((obj => obj.id == params.id));
        const newArray = [...emprestimos]
        newArray.splice(indexAlvo, 1);

        async function removeEmprestimoFromFile() {
            setEmprestimos(newArray);
            await writeTextFile(
                {
                    path: "IGDS-DATA/emprestimos-data.json",
                    contents: JSON.stringify(newArray),
                },
                { dir: BaseDirectory.AppData }
            );
        }

        removeEmprestimoFromFile()
    }

    function toggleStatus() {
        const indexAlvo = emprestimos.findIndex((obj => obj.id == params.id));
        const statusAtual = emprestimos[indexAlvo].devolvido && emprestimos[indexAlvo].devolvido
        let arrayAlvo = { ...emprestimos[indexAlvo], devolvido: !statusAtual }

        const newArray = [...emprestimos]
        newArray[indexAlvo] = arrayAlvo

        async function swapStatusInFile() {
            setEmprestimos(newArray);
            await writeTextFile(
                {
                    path: "IGDS-DATA/emprestimos-data.json",
                    contents: JSON.stringify(newArray),
                },
                { dir: BaseDirectory.AppData }
            );
        }

        swapStatusInFile()
    }

    return (
        <div className="listar-detalhes-section">
            <header className="do-not-print">
                <h3>Detalhes sobre empréstimo</h3>
                <Link to=".." relative="path">
                    <span>LISTA</span>
                    <PiKeyReturnFill />
                </Link>
            </header>

            <div className="data do-not-print">
                <span className={emprestimo.devolvido ? 'devolvido' : 'pendente'}>Status de entrega: {emprestimo.devolvido ? 'DEVOLVIDO' : 'PENDENTE'}</span>
                <span>Usuário que realizou empréstimo: {emprestimo.usuario}</span>
                <span>Nome: {emprestimo.responsavel}</span>
                <span>CPG/RG: {emprestimo.cpfResponsavel}</span>
                <span>Cidade: {emprestimo.endereco?.cidade}</span>
                <span>Bairro: {emprestimo.endereco?.bairro}</span>
                <span>Rua: {emprestimo.endereco?.rua}, Nº{emprestimo.endereco?.numeroRua}</span>
                <span className="sub-title">Items emprestados:</span>
                <span>{returnItems()}</span>
                <span className="sub-title">Contatos:</span>
                <span>{contactsToText()}</span>
                <span className="sub-title">Observação:</span>
                <span>{emprestimo.observacao}</span>
            </div>

            <div id="folha-a4">
                <div className="folha-div intro">
                    <h2>INSTITUTO GLACIA DA SILVA - CORRENTE DO BEM</h2>
                    <h3>TERMO DE EMPRÉSTIMO E RESPONSABILIDADE</h3>
                    <p>EU {emprestimo.responsavel}, PORTADOR DO RG/CPF <span className="cpf">{emprestimo.cpfResponsavel}</span>.
                        COMPROMETO-ME A ZELAR PELOS PELOS EQUIPAMENTO(S) HOSPITALAR(ES)
                        FORNECIDO(S) E EMPRESTADO(S) POR ESTA INSTITUIÇÃO.</p>
                    <p>OS EQUIPAMENTOS: {returnItems()}</p>
                    <p>E DEPOIS DE UTILIZAR, ESTOU CIENTE DA OBRIGAÇÃO DE REALIZAR A DEVOLUÇÃO PARA O <strong>
                        INSTITUTO GLACIA DA SILVA CORRENTE DO BEM.</strong></p>
                    <p>CONFIRMO TAMBÉM A VEROSSIMILIDADE DOS SEGUINTES DADOS FORNECIDOS PELO RESPONSÁVEL DO EMPRÉSTIMO:</p>
                    <p>ENDEREÇO: <br /> {emprestimo.endereco?.rua} Nº {emprestimo.endereco?.numeroRua} <br />
                        BAIRRO: {emprestimo.endereco?.bairro}. MUNICÍPIO DE {emprestimo.endereco?.cidade}-PR</p>

                    <p>CONTATOS: {contactsElements}</p>
                    <p>OBS: O extravio de quaisquer aparelhos que estejam de responsabilidade
                        do assinante, tais mas não limitados á: (cadeira de rodas, cadeira de banho,
                        cama e colhão hospitalar, muletas, botas ortopédicas, talas, tipoia, comadres,
                        papagaio, coletes ortopédicos, entre outros), será acarretado valores estipulados pela instituição.
                        A devolução dos aparelhos é de total responsabilidade do assinante e/ou familiares.</p>
                </div>
                <div className="folha-div qr">
                    <h5>Considere realizar uma doação!</h5>
                    <img src={qrCode} />
                </div>
                <div className="folha-div assinar">
                    <p className="below">Campo Magro, {new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    <p>Assinatura _______________________________________________________________</p>
                </div>
            </div>

            {showDeleteModal && <div className="delete-modal">
                <div className="container">
                    <span>Confirmar exclusão de empréstimo? (Esse processo é irreversível) </span>
                    <button onClick={() => setShowDeleteModal(false)}>NÃO</button>
                    <Link to='..' onClick={() => deleteEmprestimo()}>SIM</Link>
                </div>
            </div>}

            <div className="detalhes-container do-not-print">
                <button className="imprimir" onClick={() => window.print(document.getElementById('folha-a4'))}>IMPRIMIR COMPROVANTE DE RESPONSABILIDADE</button>
                <button className="trocar-status" onClick={() => toggleStatus()}>TROCAR STATUS DE ENTREGA</button>
                <button className="apagar" onClick={() => setShowDeleteModal(true)}>APAGAR EMPRÉSTIMO</button>
            </div>
        </div>
    )
}