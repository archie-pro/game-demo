import React from 'react'
import GameField from './GameField'
import ScoreField from "./ScoreField"
import "./Game.css"

export default class Game extends React.Component {
    render() {
        return (
            <div className="App-gameContainer">
                <GameField></GameField>
                <ScoreField></ScoreField>
            </div>
        )
    }
}