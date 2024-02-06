import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { BaseDirectory, createDir, writeTextFile, readTextFile, exists } from "@tauri-apps/api/fs";
import { AppEmprestimosContext } from "../App";

const EmprestimosContext = React.createContext();

export default function Layout() {

  const { emprestimos, setEmprestimos } = React.useContext(
    AppEmprestimosContext
  );
  function checkExistenceAndCreateFolder() {
    async function createDataFolder() {
      await createDir("IGDS-DATA", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    exists("IGDS-DATA", { dir: BaseDirectory.AppData }).then((result) => {
      if (!result) {
        createDataFolder();
      }
    });
  }
  function checkExistenceAndCreateFile() {
    async function writeFile() {
      await writeTextFile({
        path: "IGDS-DATA/emprestimos-data.json",
        contents: JSON.stringify({ nome: "ABC", rng: "123" }),
      }, {
        dir: BaseDirectory.AppData
      }
      );
    }

    exists("IGDS-DATA/emprestimos-data.json", {
      dir: BaseDirectory.AppData,
    }).then((result) => {
      if (!result) {
        writeFile();
      }
    });
  }

  React.useEffect(() => {
    checkExistenceAndCreateFolder();
    checkExistenceAndCreateFile();

    async function readFile() {
      const readTextFileContent = await readTextFile("IGDS-DATA/emprestimos-data.json", {
        dir: BaseDirectory.AppData
      }
      );
      setEmprestimos(JSON.parse(readTextFileContent));
    }

    readFile();

  }, []);

  return (
    <EmprestimosContext.Provider value={{ emprestimos, setEmprestimos}}>
      <div className="site-wrapper">
        <NavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </EmprestimosContext.Provider>
  );
}

export { EmprestimosContext };
