import React from "react";

export default class HeaderLink extends React.Component {
    render() {
        return (
            <li className={`App-headerItem ${this.props.link.active ? `active` : ``}`}>
                <a href={this.props.link.href}>{this.props.link.label}</a>
            </li>
        );
    }
}