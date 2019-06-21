import React from "react";

export default class HeaderLink extends React.Component {
    render() {
        return (
            <a href={this.props.link.href}>
                <li className={`App-headerItem ${this.props.link.active ? `active` : ``}`}>
                    {this.props.link.label}
                </li>
            </a >
        );
    }
}