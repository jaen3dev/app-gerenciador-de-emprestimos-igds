import React from "react";
import image from '../assets/igds-logo.png'

export default function Home(){
    return(
        <div className="home-section">
            <h2>INSTITUTO GLACIA DA SILVA</h2>
            <img src={image} loading="lazy"/>
            <h2>CORRENTE DO BEM</h2>
        </div>
    )
}