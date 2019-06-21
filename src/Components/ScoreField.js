import React from 'react'
import "./Game.css"

export default class ScoreField extends React.Component {
    render() {
        return (
            <div className="App-scoreField">
                <h3>Score: {this.props.score.points}</h3>
                <h3>Level: {this.props.score.level}</h3>
            </div>
        )
    }
}