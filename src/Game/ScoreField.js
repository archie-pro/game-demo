import React from 'react'
import "./Game.css"

export default class ScoreField extends React.Component {
    render() {
        return (
            <div className="App-scoreField">
                <h3>Score: 9999999</h3>
                <h3>Level: 99</h3>
            </div>
        )
    }
}