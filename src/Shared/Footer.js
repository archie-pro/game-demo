import React from 'react';
import "./Shared.css"

export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <h3>Artsiom Prakapovich. {new Date().getFullYear()}</h3>
            </footer>
        )
    }
}