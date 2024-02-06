import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Adicionar from "./pages/Adicionar";
import Listar from "./pages/Listar";
import ListarDetalhes from "./pages/ListarDetalhes";

const AppEmprestimosContext = React.createContext();

function App() {
  const [emprestimos, setEmprestimos] = React.useState([]);

  return (
    <AppEmprestimosContext.Provider value={{ emprestimos, setEmprestimos }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="adicionar" element={<Adicionar />} />
            <Route path="listar" element={<Listar />} />
            <Route path="listar/:id" element={<ListarDetalhes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppEmprestimosContext.Provider>
  );
}

export { AppEmprestimosContext };
export default App;
