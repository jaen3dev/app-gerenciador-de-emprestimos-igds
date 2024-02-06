import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {

    return (
        <nav className="do-not-print">
            <div className="links">
                <NavLink to='/adicionar' className={({isActive}) => isActive ? "selected" : null}>Adicionar</NavLink>
                <NavLink to='/listar' className={({isActive}) => isActive ? "selected" : null}>Listar</NavLink>
            </div>
        </nav>
    )
}
