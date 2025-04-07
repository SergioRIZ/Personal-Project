import { Link } from "../../../Link"
import { useState, useEffect } from "react";

export default function Settings(){

    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, [language]);

    return (
        <div className="settings">
            <Link to="/"> 
            Pokedex
            </Link>

            <h1>Settings</h1>
            <p>Settings page content goes here.</p>
            <p>Current language: {language}</p>
            <button onClick={() => setLanguage("en")}>EN</button>
        </div>
    )
}