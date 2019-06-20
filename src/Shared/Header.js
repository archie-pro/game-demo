import React from 'react';
import HeaderLink from "./HeaderLink.js"
import logo from "./logo.png";
import "./Header.css"

export default class Header extends React.Component {
    render() {
        const links = [
            { href: "./tetris", label: "Tetris" },
            { href: "./tanks", label: "Tanks" },
            { href: "./racing", label: "Racing" }
        ];
        return (
            <header className="App-header" >
                <a href=".">
                    <img className="App-headerLogo" src={logo} alt="logo" />
                </a>
                <ul>
                    {links.map((link) => <HeaderLink key={link.href} link={link} />)}
                </ul>
            </header>
        );
    }
}
